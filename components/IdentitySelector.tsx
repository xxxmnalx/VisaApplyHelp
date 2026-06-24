"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EligibilityChoice } from "@/lib/flow-types";

type IdentitySelectorProps = {
  flowId: string;
  choices: EligibilityChoice[];
  destination: string;
};

export function IdentitySelector({
  flowId,
  choices,
  destination,
}: IdentitySelectorProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [hasChinesePassport, setHasChinesePassport] = useState(false);
  const [isInUnitedStates, setIsInUnitedStates] = useState(false);
  const [isAdult, setIsAdult] = useState(false);

  const selectedChoice = choices.find((choice) => choice.id === selectedStatus);
  const canContinue =
    Boolean(selectedChoice?.supported) &&
    hasChinesePassport &&
    isInUnitedStates &&
    isAdult;

  function handleContinue() {
    if (!canContinue || !selectedStatus) return;

    window.localStorage.setItem(
      `visa-flow:${flowId}:identity`,
      JSON.stringify({ selectedStatus, savedAt: new Date().toISOString() }),
    );
    router.push(destination);
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          1. 选择你当前的美国身份
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {choices.map((choice) => (
            <label
              key={choice.id}
              className={`rounded-xl border p-4 ${
                choice.supported
                  ? "cursor-pointer border-slate-200 bg-white hover:border-blue-300"
                  : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="status"
                  value={choice.id}
                  disabled={!choice.supported}
                  checked={selectedStatus === choice.id}
                  onChange={() => setSelectedStatus(choice.id)}
                  className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="block font-medium">{choice.label}</span>
                  <span className="mt-1 block text-xs">{choice.note}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          2. 确认基础条件
        </legend>
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          {[
            {
              label: "我持中华人民共和国普通护照",
              checked: hasChinesePassport,
              setChecked: setHasChinesePassport,
            },
            {
              label: "我目前人在美国",
              checked: isInUnitedStates,
              setChecked: setIsInUnitedStates,
            },
            {
              label: "我已年满 18 岁",
              checked: isAdult,
              setChecked: setIsAdult,
            },
          ].map((item) => (
            <label key={item.label} className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(event) => item.setChecked(event.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {selectedChoice && !selectedChoice.supported ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          该身份尚未开放。我们保留了配置扩展能力，但不会让你误用 F-1 流程。
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        加载我的申请流程
      </button>
    </div>
  );
}
