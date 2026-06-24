import { normalizeProgress } from "@/lib/domain/progress";
import type {
  FlowConfig,
  FlowIdentitySelection,
  FlowProgressState,
} from "@/lib/flow-types";
import type {
  FlowIdentityRepository,
  FlowProgressRepository,
} from "@/lib/repositories/flow-progress-repository";

const PREFIX = "visa-flow";

export class LocalFlowProgressRepository implements FlowProgressRepository {
  async load(flow: FlowConfig): Promise<FlowProgressState | null> {
    const raw = window.localStorage.getItem(progressKey(flow.id));
    if (!raw) return null;

    try {
      return normalizeProgress(JSON.parse(raw) as unknown, flow);
    } catch {
      window.localStorage.removeItem(progressKey(flow.id));
      return null;
    }
  }

  async save(progress: FlowProgressState): Promise<void> {
    window.localStorage.setItem(
      progressKey(progress.flowId),
      JSON.stringify(progress),
    );
  }

  async clear(flowId: string): Promise<void> {
    window.localStorage.removeItem(progressKey(flowId));
  }
}

export class LocalFlowIdentityRepository implements FlowIdentityRepository {
  async load(flowId: string): Promise<FlowIdentitySelection | null> {
    const raw = window.localStorage.getItem(identityKey(flowId));
    if (!raw) return null;

    try {
      const value = JSON.parse(raw) as Partial<FlowIdentitySelection>;
      if (
        value.flowId !== flowId ||
        typeof value.selectedStatus !== "string" ||
        typeof value.savedAt !== "string"
      ) {
        return null;
      }
      return value as FlowIdentitySelection;
    } catch {
      window.localStorage.removeItem(identityKey(flowId));
      return null;
    }
  }

  async save(selection: FlowIdentitySelection): Promise<void> {
    window.localStorage.setItem(
      identityKey(selection.flowId),
      JSON.stringify(selection),
    );
  }

  async clear(flowId: string): Promise<void> {
    window.localStorage.removeItem(identityKey(flowId));
  }
}

function progressKey(flowId: string): string {
  return `${PREFIX}:${flowId}:progress`;
}

function identityKey(flowId: string): string {
  return `${PREFIX}:${flowId}:identity`;
}
