import { normalizeProgress } from "@/lib/domain/progress";
import type {
  FlowConfig,
  FlowProgressState,
  UserIdentitySelection,
} from "@/lib/flow-types";
import type {
  FlowProgressRepository,
  UserIdentityRepository,
} from "@/lib/repositories/flow-progress-repository";

const PREFIX = "visa-flow";
const IDENTITY_KEY = `${PREFIX}:identity`;

// 浏览器禁用站点数据时，访问 window.localStorage 本身就会抛 SecurityError；
// 全部经由安全封装，存储不可用时降级为「无进度可存取」而不是页面卡死。
function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 存储不可用时无可清除。
  }
}

export class LocalFlowProgressRepository implements FlowProgressRepository {
  async load(flow: FlowConfig): Promise<FlowProgressState | null> {
    const raw = safeGetItem(progressKey(flow.id));
    if (!raw) return null;

    try {
      return normalizeProgress(JSON.parse(raw) as unknown, flow);
    } catch {
      safeRemoveItem(progressKey(flow.id));
      return null;
    }
  }

  async save(progress: FlowProgressState): Promise<void> {
    safeSetItem(progressKey(progress.flowId), JSON.stringify(progress));
  }

  async clear(flowId: string): Promise<void> {
    safeRemoveItem(progressKey(flowId));
  }
}

export class LocalUserIdentityRepository implements UserIdentityRepository {
  async load(): Promise<UserIdentitySelection | null> {
    const raw = safeGetItem(IDENTITY_KEY);
    if (!raw) return null;

    try {
      const value = JSON.parse(raw) as Partial<UserIdentitySelection>;
      if (
        typeof value.statusCode !== "string" ||
        typeof value.savedAt !== "string" ||
        typeof value.consentAcceptedAt !== "string"
      ) {
        return null;
      }
      return value as UserIdentitySelection;
    } catch {
      safeRemoveItem(IDENTITY_KEY);
      return null;
    }
  }

  async save(selection: UserIdentitySelection): Promise<void> {
    safeSetItem(IDENTITY_KEY, JSON.stringify(selection));
  }

  async clear(): Promise<void> {
    safeRemoveItem(IDENTITY_KEY);
  }
}

/**
 * 清除本站在当前浏览器保存的全部数据（所有流程进度 + 身份选择），
 * 兑现隐私页「清除即不再保留」的承诺（PROJECT_CORE §5.4）。
 */
export function clearAllLocalData(): void {
  try {
    const keys: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith(`${PREFIX}:`)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // 存储不可用时无可清除。
  }
}

export function getIdentityStorageKey(): string {
  return IDENTITY_KEY;
}

export function getProgressStorageKey(flowId: string): string {
  return progressKey(flowId);
}

function progressKey(flowId: string): string {
  return `${PREFIX}:${flowId}:progress`;
}
