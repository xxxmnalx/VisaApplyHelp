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
  /** 需要多行展开说明的任务（如资金证明）逐条要点。 */
  detailPoints?: string[];
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
  /** 该步骤可记录的本地时间节点（合并步骤后一步可含多个）。 */
  timelineEvents?: TimelineEvent[];
  /** 该步骤顶部渲染费用/处理时间/时间线占位的总览面板。 */
  showSummaryPanel?: boolean;
  /** 该步骤顶部渲染拿签 ETA 估算器。 */
  showEtaEstimator?: boolean;
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

/** 身份门要求用户必须满足的单条适用条件（数据化以便两按钮下钻）。 */
export type EligibilityCondition = {
  id: string;
  label: string;
  /** 不满足该条时给用户的提示与去向说明。 */
  unsupportedHint: string;
};

/** 国籍/护照维度，避免把「中国护照」写死在 UI 与文案中。 */
export type Nationality = {
  label: string;
  slug: string;
  note: string;
};

/** ETA 估算的单个阶段（天数区间 + 官方/经验来源属性）。 */
export type EtaStage = {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  basis: "official" | "experience";
  sourceId?: string;
  note?: string;
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
  nationality: Nationality;
  lastVerified: string;
  officialFee: string;
  biometricsFee: string;
  eligibilityChoices: EligibilityChoice[];
  eligibilityConditions: EligibilityCondition[];
  etaStages: EtaStage[];
  processingTimeSourceId?: string;
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
  /** 用户已阅读并同意「使用须知」的时间（ISO）。未同意则不进入流程。 */
  consentAcceptedAt?: string;
};
