import type {
  FlowConfig,
  FlowIdentitySelection,
  FlowProgressState,
} from "@/lib/flow-types";

export interface FlowProgressRepository {
  load(flow: FlowConfig): Promise<FlowProgressState | null>;
  save(progress: FlowProgressState): Promise<void>;
  clear(flowId: string): Promise<void>;
}

export interface FlowIdentityRepository {
  load(flowId: string): Promise<FlowIdentitySelection | null>;
  save(selection: FlowIdentitySelection): Promise<void>;
  clear(flowId: string): Promise<void>;
}
