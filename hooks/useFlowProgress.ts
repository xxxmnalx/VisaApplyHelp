"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createEmptyProgress,
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
  LocalFlowIdentityRepository,
  LocalFlowProgressRepository,
} from "@/lib/repositories/local-flow-repository";

type UseFlowProgressResult = {
  isLoaded: boolean;
  isIdentityValid: boolean;
  progress: FlowProgressState;
  updateTask: (stepId: string, taskId: string, state: TaskState | null) => void;
  updateTimelineDate: (eventId: string, date: string) => void;
  resetProgress: () => Promise<void>;
};

export function useFlowProgress(
  flow: FlowConfig,
  currentStepId: string,
): UseFlowProgressResult {
  const progressRepository = useMemo(
    () => new LocalFlowProgressRepository(),
    [],
  );
  const identityRepository = useMemo(
    () => new LocalFlowIdentityRepository(),
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
      const identity = await identityRepository.load(flow.id);
      if (!isActive) return;

      const identityIsValid =
        identity?.selectedStatus === flow.status &&
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

  useEffect(() => {
    if (!isLoaded || !isIdentityValid) return;
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
    // 清除进度时一并清掉身份选择键，避免 localStorage 残留 selectedStatus，
    // 兑现隐私页「清除即不再保留」的承诺（PROJECT_CORE §5.4）。
    await Promise.all([
      progressRepository.clear(flow.id),
      identityRepository.clear(flow.id),
    ]);
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
