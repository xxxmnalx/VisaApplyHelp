import type {
  FlowConfig,
  FlowProgressState,
  FlowStep,
  TaskState,
} from "@/lib/flow-types";

export function createEmptyProgress(
  flow: FlowConfig,
  now = new Date().toISOString(),
): FlowProgressState {
  return {
    flowId: flow.id,
    version: flow.version,
    selectedStatus: flow.status,
    currentStepId: flow.steps[0]?.id ?? "",
    taskStates: {},
    timelineDates: {},
    revision: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeProgress(
  value: unknown,
  flow: FlowConfig,
): FlowProgressState | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<FlowProgressState>;
  if (
    candidate.flowId !== flow.id ||
    candidate.version !== flow.version ||
    candidate.selectedStatus !== flow.status
  ) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    flowId: flow.id,
    version: flow.version,
    selectedStatus: flow.status,
    currentStepId:
      typeof candidate.currentStepId === "string"
        ? candidate.currentStepId
        : flow.steps[0]?.id ?? "",
    taskStates:
      candidate.taskStates && typeof candidate.taskStates === "object"
        ? candidate.taskStates
        : {},
    timelineDates:
      candidate.timelineDates && typeof candidate.timelineDates === "object"
        ? candidate.timelineDates
        : {},
    revision:
      typeof candidate.revision === "number" && candidate.revision >= 0
        ? candidate.revision
        : 0,
    createdAt:
      typeof candidate.createdAt === "string" ? candidate.createdAt : now,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : now,
  };
}

export function setCurrentStep(
  progress: FlowProgressState,
  stepId: string,
): FlowProgressState {
  if (progress.currentStepId === stepId) return progress;
  return withRevision(progress, { currentStepId: stepId });
}

export function setTaskState(
  progress: FlowProgressState,
  stepId: string,
  taskId: string,
  state: TaskState | null,
): FlowProgressState {
  const key = `${stepId}:${taskId}`;
  const taskStates = { ...progress.taskStates };
  if (state) taskStates[key] = state;
  else delete taskStates[key];
  return withRevision(progress, { taskStates });
}

export function setTimelineDate(
  progress: FlowProgressState,
  eventId: string,
  date: string,
): FlowProgressState {
  const timelineDates = { ...progress.timelineDates };
  if (date) timelineDates[eventId] = date;
  else delete timelineDates[eventId];
  return withRevision(progress, { timelineDates });
}

export function calculateCompletionPercentage(
  flow: FlowConfig,
  progress: FlowProgressState,
): number {
  const totalTasks = flow.steps.reduce(
    (total, current) => total + current.tasks.length,
    0,
  );
  if (totalTasks === 0) return 0;

  const completedTasks = Object.values(progress.taskStates).filter(
    (state) => state === "completed",
  ).length;
  return Math.round((completedTasks / totalTasks) * 100);
}

export function countMissingRequiredTasks(
  step: FlowStep,
  progress: FlowProgressState,
): number {
  return step.tasks.filter(
    (task) =>
      task.kind === "required" &&
      progress.taskStates[`${step.id}:${task.id}`] !== "completed",
  ).length;
}

function withRevision(
  progress: FlowProgressState,
  changes: Partial<FlowProgressState>,
): FlowProgressState {
  return {
    ...progress,
    ...changes,
    revision: progress.revision + 1,
    updatedAt: new Date().toISOString(),
  };
}
