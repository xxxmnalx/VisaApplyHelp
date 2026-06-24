import type { TaskState } from "@/lib/flow-types";

/**
 * Future database-facing contract. v0.1 does not persist this model remotely.
 * Keeping it separate from UI state prevents a future database schema from
 * leaking into React components.
 */
export type ApplicationRunRecord = {
  id: string;
  userId: string;
  flowId: string;
  flowVersion: string;
  statusCode: string;
  currentStepId: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ApplicationTaskStateRecord = {
  applicationRunId: string;
  stepId: string;
  taskId: string;
  state: TaskState;
  updatedAt: string;
};

export type ApplicationTimelineEventRecord = {
  applicationRunId: string;
  eventKey: string;
  eventDate: string;
  updatedAt: string;
};
