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

/**
 * 步骤上「有期限的事实」：琥珀 chip 常驻陈述期限，不倒数、不闪烁。
 * 只写官方核验过的期限；数字未经核验时 chip 用「限期」类措辞、期限细节放 note。
 */
export type StepDeadline = {
  /** 节点与列表上的短标签（如「限 30 天」）。 */
  chip: string;
  /** 期限的一句完整说明。 */
  note: string;
  /** 录入哪个时间线日期后可推算到期日（可选）。 */
  eventId?: string;
  /** 自 eventId 日期起的官方期限天数（可选，仅限已核验数字）。 */
  days?: number;
};

export type FlowStep = {
  id: string;
  slug: string;
  title: string;
  /** 全程里程碑进度条上的节点短标签（2–4 字），第一步即可看到全部节点。 */
  milestone: string;
  summary: string;
  tasks: FlowTask[];
  officialLinkIds?: string[];
  /** 该步骤可记录的本地时间节点（合并步骤后一步可含多个）。 */
  timelineEvents?: TimelineEvent[];
  /** 该步骤顶部渲染费用/处理时间/时间线占位的总览面板。 */
  showSummaryPanel?: boolean;
  /** 该步骤顶部渲染拿签 ETA 估算器。 */
  showEtaEstimator?: boolean;
  /** 该步骤存在官方期限时的死线信息（里程碑琥珀 chip + 说明）。 */
  deadline?: StepDeadline;
};

export type OfficialSource = {
  id: string;
  label: string;
  organization: string;
  url: string;
  lastVerified: string;
};

/** 美国身份选项（身份确认页使用，与具体国家流程解耦）。 */
export type UsIdentityOption = {
  code: string;
  slug: string;
  label: string;
  shortLabel: string;
  note: string;
  supported: boolean;
};

/** 身份确认页的硬性适用条件（决定能否使用本站流程，数据化以便下钻提示）。 */
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

/**
 * 结构化费用分项：金额为官方核验值（随 flow.lastVerified），
 * `approximate` 表示官方口径本身为「约」；上限、减免等口径差异写进 note。
 */
export type FeeItem = {
  id: string;
  label: string;
  amount: number;
  /** ISO 4217 货币码，如 CAD / JPY / USD。 */
  currency: string;
  approximate?: boolean;
  note?: string;
};

export type FlowConfig = {
  id: string;
  version: string;
  countryCode: string;
  countrySlug: string;
  countryName: string;
  /** 国家旗帜 emoji，用于国家选择卡片与流程标签。 */
  countryFlag: string;
  visaType: string;
  visaTypeSlug: string;
  status: string;
  statusSlug: string;
  statusLabel: string;
  audience: string;
  nationality: Nationality;
  lastVerified: string;
  officialFee: string;
  /** 无生物信息采集环节的国家可省略。 */
  biometricsFee?: string;
  /** 结构化费用分项（有则费用面板渲染分项 + 总计 + 美元参考换算）。 */
  feeItems?: FeeItem[];
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

/** 全站唯一的身份选择记录（与具体国家流程解耦，先确认身份再选国家）。 */
export type UserIdentitySelection = {
  statusCode: string;
  savedAt: string;
  /** 用户已阅读并同意「使用须知」的时间（ISO）。未同意则不进入流程。 */
  consentAcceptedAt: string;
};
