export type FlowTaskKind =
  | "required"
  | "recommended"
  | "conditional"
  | "informational";

export type FlowTask = {
  id: string;
  title: string;
  description?: string;
  kind: FlowTaskKind;
  sourceIds?: string[];
};

export type TimelineEvent = {
  id: string;
  label: string;
  description: string;
};

export type FlowStep = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tasks: FlowTask[];
  officialLinkIds?: string[];
  timelineEvent?: TimelineEvent;
};

export type OfficialSource = {
  id: string;
  label: string;
  organization: string;
  url: string;
  lastVerified: string;
};

export type EligibilityChoice = {
  id: string;
  label: string;
  supported: boolean;
  note: string;
};

export type FlowConfig = {
  id: string;
  version: string;
  countryCode: string;
  countrySlug: string;
  countryName: string;
  visaType: string;
  visaTypeSlug: string;
  status: string;
  statusSlug: string;
  statusLabel: string;
  audience: string;
  lastVerified: string;
  officialFee: string;
  biometricsFee: string;
  eligibilityChoices: EligibilityChoice[];
  sources: OfficialSource[];
  steps: FlowStep[];
};

export type TaskState = "completed" | "skipped";

export type FlowProgressState = {
  flowId: string;
  version: string;
  selectedStatus: string;
  currentStepId: string;
  taskStates: Record<string, TaskState>;
  timelineDates: Record<string, string>;
  revision: number;
  createdAt: string;
  updatedAt: string;
};

export type FlowIdentitySelection = {
  flowId: string;
  selectedStatus: string;
  savedAt: string;
};
