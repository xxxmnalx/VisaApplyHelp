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
  /**
   * 允许把这个必做任务标记为「不适用」（标记后从完成度分母剔除）。
   * 用于「满足条件才适用」的必做项，例如无需采集生物信息时的采集步骤。
   */
  allowNotApplicable?: boolean;
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
  /** 该步骤顶部渲染费用/处理时间/时间线占位的总览面板。 */
  showSummaryPanel?: boolean;
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

export type TaskState = "completed" | "skipped" | "not-applicable";

export const TASK_STATES: readonly TaskState[] = [
  "completed",
  "skipped",
  "not-applicable",
];

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
