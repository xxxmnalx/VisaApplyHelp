"use client";

import { useEffect, useState } from "react";
import type { Flow, UsStatus } from "@/lib/types";
import StepCard from "./StepCard";

type WizardShellProps = {
  flow: Flow;
  status: UsStatus;
};

export default function WizardShell({ flow, status }: WizardShellProps) {
  const stepStorageKey = `vah:step:${flow.id}:${status}`;
  const materialsStorageKey = `vah:materials:${flow.id}:${status}`;

  const filteredMaterials = flow.materials.filter(
    (m) => m.forStatus === "*" || m.forStatus.includes(status),
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(stepStorageKey);
    if (saved !== null) {
      const n = Number.parseInt(saved, 10);
      if (Number.isFinite(n) && n >= 0 && n < flow.steps.length) {
        setStepIndex(n);
      }
    }
    setHydrated(true);
  }, [stepStorageKey, flow.steps.length]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(stepStorageKey, String(stepIndex));
  }, [stepIndex, stepStorageKey, hydrated]);

  const step = flow.steps[stepIndex];
  const progressPct = Math.round(((stepIndex + 1) / flow.steps.length) * 100);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>进度</span>
          <span>
            {stepIndex + 1} / {flow.steps.length}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-neutral-800 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mt-6">
        <StepCard
          step={step}
          index={stepIndex}
          total={flow.steps.length}
          materials={filteredMaterials}
          materialsStorageKey={materialsStorageKey}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40"
        >
          上一步
        </button>
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.min(flow.steps.length - 1, i + 1))}
          disabled={stepIndex === flow.steps.length - 1}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
