import {
  TASK_STATES,
  type FlowConfig,
  type FlowProgressState,
  type FlowStep,
  type TaskState,
} from "@/lib/flow-types";

const VALID_TASK_STATES = new Set<string>(TASK_STATES);

function sanitizeTaskStates(value: unknown): Record<string, TaskState> {
  if (!value || typeof value !== "object") return {};
  const result: Record<string, TaskState> = {};
  for (const [key, state] of Object.entries(value as Record<string, unknown>)) {
    if (typeof state === "string" && VALID_TASK_STATES.has(state)) {
      result[key] = state as TaskState;
    }
  }
  return result;
}

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
    taskStates: sanitizeTaskStates(candidate.taskStates),
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
  // 「本站流程完成度」只衡量当前适用的核心（必做）任务，不计建议、
  // 条件、阅读确认或标记为不适用的事项（见 PRODUCT_SPEC §7.4）。
  const applicableRequiredKeys = flow.steps.flatMap((step) =>
    step.tasks
      .filter((task) => task.kind === "required")
      .map((task) => `${step.id}:${task.id}`)
      .filter((key) => progress.taskStates[key] !== "not-applicable"),
  );
  if (applicableRequiredKeys.length === 0) return 0;

  const completedRequired = applicableRequiredKeys.filter(
    (key) => progress.taskStates[key] === "completed",
  ).length;
  return Math.round((completedRequired / applicableRequiredKeys.length) * 100);
}

export function countMissingRequiredTasks(
  step: FlowStep,
  progress: FlowProgressState,
): number {
  return step.tasks.filter((task) => {
    if (task.kind !== "required") return false;
    const state = progress.taskStates[`${step.id}:${task.id}`];
    return state !== "completed" && state !== "not-applicable";
  }).length;
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
