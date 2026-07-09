import type {
  FlowConfig,
  FlowProgressState,
  UserIdentitySelection,
} from "@/lib/flow-types";

export interface FlowProgressRepository {
  load(flow: FlowConfig): Promise<FlowProgressState | null>;
  save(progress: FlowProgressState): Promise<void>;
  clear(flowId: string): Promise<void>;
}

/** 全站唯一身份选择的存储契约（身份与具体国家流程解耦，先确认身份再选国家）。 */
export interface UserIdentityRepository {
  load(): Promise<UserIdentitySelection | null>;
  save(selection: UserIdentitySelection): Promise<void>;
  clear(): Promise<void>;
}
