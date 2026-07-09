"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createEmptyProgress,
  normalizeProgress,
  setCurrentStep,
  setTaskState,
  setTimelineDate,
} from "@/lib/domain/progress";
import type {
  FlowConfig,
  FlowProgressState,
  TaskState,
} from "@/lib/flow-types";
import {
  LocalFlowProgressRepository,
  LocalUserIdentityRepository,
  clearAllLocalData,
  getIdentityStorageKey,
  getProgressStorageKey,
} from "@/lib/repositories/local-flow-repository";

type UseFlowProgressResult = {
  isLoaded: boolean;
  isIdentityValid: boolean;
  progress: FlowProgressState;
  updateTask: (stepId: string, taskId: string, state: TaskState | null) => void;
  updateTimelineDate: (eventId: string, date: string) => void;
  resetProgress: () => Promise<void>;
};

/** 用户尚无任何操作的初始状态不写入存储，避免国家卡片被误标「进行中」。 */
function isPristine(progress: FlowProgressState): boolean {
  return (
    progress.revision === 0 &&
    Object.keys(progress.taskStates).length === 0 &&
    Object.keys(progress.timelineDates).length === 0
  );
}

export function useFlowProgress(
  flow: FlowConfig,
  currentStepId: string,
): UseFlowProgressResult {
  const progressRepository = useMemo(
    () => new LocalFlowProgressRepository(),
    [],
  );
  const identityRepository = useMemo(
    () => new LocalUserIdentityRepository(),
    [],
  );
  const [progress, setProgress] = useState<FlowProgressState>(() =>
    createEmptyProgress(flow),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIdentityValid, setIsIdentityValid] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function load() {
      // 身份为全站唯一记录；进入某条流程要求身份与该流程匹配且已同意使用须知。
      const identity = await identityRepository.load();
      if (!isActive) return;

      const identityIsValid =
        identity?.statusCode === flow.status &&
        Boolean(identity?.consentAcceptedAt);
      setIsIdentityValid(identityIsValid);
      if (!identityIsValid) {
        setIsLoaded(true);
        return;
      }

      const saved = await progressRepository.load(flow);
      if (!isActive) return;

      setProgress(
        setCurrentStep(saved ?? createEmptyProgress(flow), currentStepId),
      );
      setIsLoaded(true);
    }

    void load();
    return () => {
      isActive = false;
    };
  }, [
    currentStepId,
    flow,
    identityRepository,
    progressRepository,
  ]);

  // 多标签页同步：其他标签页清除身份（含「清除全部数据」）时立即失效本页，
  // 阻止本页把已删除的进度重新写回存储；其他标签页更新本流程进度时采纳更新的版本。
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      const identityKey = getIdentityStorageKey();
      const progressKey = getProgressStorageKey(flow.id);

      if (event.key === null || event.key === identityKey) {
        if (event.key === null || !event.newValue) {
          setIsIdentityValid(false);
          return;
        }
        try {
          const identity = JSON.parse(event.newValue) as {
            statusCode?: unknown;
          };
          if (identity.statusCode !== flow.status) setIsIdentityValid(false);
        } catch {
          setIsIdentityValid(false);
        }
        return;
      }

      if (event.key === progressKey && event.newValue) {
        try {
          const incoming = normalizeProgress(
            JSON.parse(event.newValue) as unknown,
            flow,
          );
          if (!incoming) return;
          // 只接受更新的版本；保留本页所在步骤但不递增 revision，
          // 否则两个处于不同步骤的标签页会互相触发写入形成回环。
          setProgress((current) =>
            incoming.revision > current.revision
              ? { ...incoming, currentStepId: current.currentStepId }
              : current,
          );
        } catch {
          // 非法外部写入直接忽略。
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [flow]);

  useEffect(() => {
    if (!isLoaded || !isIdentityValid) return;
    if (isPristine(progress)) return;
    void progressRepository.save(progress);
  }, [isIdentityValid, isLoaded, progress, progressRepository]);

  function updateTask(
    stepId: string,
    taskId: string,
    state: TaskState | null,
  ) {
    setProgress((current) => setTaskState(current, stepId, taskId, state));
  }

  function updateDate(eventId: string, date: string) {
    setProgress((current) => setTimelineDate(current, eventId, date));
  }

  async function resetProgress() {
    // 身份现在跨国家共享：清除时一并移除全部流程进度与身份选择，
    // 兑现隐私页「清除即不再保留」的承诺（PROJECT_CORE §5.4）。
    clearAllLocalData();
    setProgress(createEmptyProgress(flow));
    setIsIdentityValid(false);
  }

  return {
    isLoaded,
    isIdentityValid,
    progress,
    updateTask,
    updateTimelineDate: updateDate,
    resetProgress,
  };
}
