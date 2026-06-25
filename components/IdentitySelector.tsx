"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FlowConfig } from "@/lib/flow-types";
import { getStepPath } from "@/lib/flows";
import { LocalFlowIdentityRepository } from "@/lib/repositories/local-flow-repository";

type IdentitySelectorProps = {
  flow: FlowConfig;
  consentAcceptedAt: string;
};

export function IdentitySelector({
  flow,
  consentAcceptedAt,
}: IdentitySelectorProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  // null = 尚未选择；true = 符合全部；false = 有不符合，进入下钻
  const [meetsAll, setMeetsAll] = useState<boolean | null>(null);
  const [failingConditionId, setFailingConditionId] = useState<string | null>(
    null,
  );

  const selectedChoice = flow.eligibilityChoices.find(
    (choice) => choice.id === selectedStatus,
  );
  const failingCondition = flow.eligibilityConditions.find(
    (condition) => condition.id === failingConditionId,
  );
  const officialVisitorVisaSource =
    flow.sources.find((source) => source.id === "visitor-overview") ??
    flow.sources.find((source) => source.id === "apply");
  const checkVisaSource = flow.sources.find(
    (source) => source.id === "check-visa-eta",
  );

  const canContinue =
    Boolean(selectedChoice?.supported) && meetsAll === true;

  async function handleContinue() {
    if (!canContinue || !selectedStatus) return;
    const identityRepository = new LocalFlowIdentityRepository();
    await identityRepository.save({
      flowId: flow.id,
      selectedStatus,
      savedAt: new Date().toISOString(),
      consentAcceptedAt,
    });
    router.push(getStepPath(flow, flow.steps[0].slug));
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          1. 选择你当前的美国身份
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {flow.eligibilityChoices.map((choice) => (
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

      {selectedChoice && !selectedChoice.supported ? (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <p>
            该身份尚未开放。我们保留了配置扩展能力，但不会让你误用 F-1 流程。
          </p>
          {officialVisitorVisaSource ? (
            <a
              href={officialVisitorVisaSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
            >
              前往加拿大官方访客签证页面（{officialVisitorVisaSource.organization}）↗
              <span className="sr-only">（在新标签页打开）</span>
            </a>
          ) : null}
        </div>
      ) : null}

      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          2. 确认以下条件
        </legend>
        <p className="mt-1 text-xs text-slate-500">
          本流程需要你同时符合以下全部条件：
        </p>
        <ul className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          {flow.eligibilityConditions.map((condition) => (
            <li
              key={condition.id}
              className="flex items-start gap-2 text-sm text-slate-800"
            >
              <span aria-hidden className="mt-0.5 text-slate-400">
                •
              </span>
              <span>{condition.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed={meetsAll === true}
            onClick={() => {
              setMeetsAll(true);
              setFailingConditionId(null);
            }}
            className={`min-h-[44px] rounded-xl border px-4 py-3 text-sm font-medium transition ${
              meetsAll === true
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            我符合以上全部
          </button>
          <button
            type="button"
            aria-pressed={meetsAll === false}
            onClick={() => setMeetsAll(false)}
            className={`min-h-[44px] rounded-xl border px-4 py-3 text-sm font-medium transition ${
              meetsAll === false
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            有不符合的
          </button>
        </div>
      </fieldset>

      {meetsAll === false ? (
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            选择不符合的那一项：
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {flow.eligibilityConditions.map((condition) => (
              <button
                key={condition.id}
                type="button"
                aria-pressed={failingConditionId === condition.id}
                onClick={() => setFailingConditionId(condition.id)}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-medium transition ${
                  failingConditionId === condition.id
                    ? "bg-amber-600 text-white"
                    : "bg-white text-amber-900 hover:bg-amber-100"
                }`}
              >
                {condition.label}
              </button>
            ))}
          </div>
          {failingCondition ? (
            <div className="mt-3 text-sm leading-relaxed text-amber-900">
              <p>{failingCondition.unsupportedHint}</p>
              {checkVisaSource ? (
                <a
                  href={checkVisaSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-[44px] items-center font-medium underline underline-offset-2 hover:text-amber-950"
                >
                  用官方工具确认你需要的入境文件（{checkVisaSource.organization}）↗
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
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
