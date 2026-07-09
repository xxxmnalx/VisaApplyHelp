"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IDENTITY_GATE_CONDITIONS,
  US_IDENTITY_OPTIONS,
} from "@/config/identities";
import { LocalUserIdentityRepository } from "@/lib/repositories/local-flow-repository";

type IdentitySelectorProps = {
  consentAcceptedAt: string;
  /** 已保存过身份的回访用户，预选其上次的身份。 */
  initialStatusCode?: string | null;
};

export function IdentitySelector({
  consentAcceptedAt,
  initialStatusCode = null,
}: IdentitySelectorProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    US_IDENTITY_OPTIONS.find(
      (option) => option.code === initialStatusCode && option.supported,
    )?.code ?? null,
  );
  const [gateConfirmed, setGateConfirmed] = useState(
    Boolean(initialStatusCode),
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectedOption = US_IDENTITY_OPTIONS.find(
    (option) => option.code === selectedStatus,
  );
  const canContinue =
    Boolean(selectedOption?.supported) && gateConfirmed && !isSaving;

  async function handleContinue() {
    if (!canContinue || !selectedStatus) return;
    setIsSaving(true);
    const identityRepository = new LocalUserIdentityRepository();
    await identityRepository.save({
      statusCode: selectedStatus,
      savedAt: new Date().toISOString(),
      consentAcceptedAt,
    });
    // 浏览器禁用站点数据时保存会静默失败；回读校验，避免跳到国家页又被弹回。
    const persisted = await identityRepository.load();
    if (persisted?.statusCode !== selectedStatus) {
      setIsSaving(false);
      window.alert(
        "你的浏览器禁用了本地存储（Cookie / 站点数据），本站无法保存身份与进度。请在浏览器设置中允许本站数据后重试。",
      );
      return;
    }
    router.push("/countries");
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          1. 选择你当前的美国身份
        </legend>
        <p className="mt-1 text-xs text-slate-500">
          身份决定各国流程中的材料清单；确认后即可选择要申请的国家。
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {US_IDENTITY_OPTIONS.map((option) => (
            <label
              key={option.code}
              className={`rounded-2xl border p-4 transition ${
                option.supported
                  ? selectedStatus === option.code
                    ? "cursor-pointer border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600"
                    : "cursor-pointer border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow"
                  : "cursor-not-allowed border-dashed border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="status"
                  value={option.code}
                  disabled={!option.supported}
                  checked={selectedStatus === option.code}
                  onChange={() => setSelectedStatus(option.code)}
                  className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="block font-medium">{option.label}</span>
                  <span className="mt-1 block text-xs">{option.note}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-base font-semibold text-slate-950">
          2. 确认适用条件
        </legend>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {IDENTITY_GATE_CONDITIONS.map((condition) => (
              <li
                key={condition.id}
                className="flex items-start gap-2 text-sm text-slate-800"
              >
                <span aria-hidden className="mt-0.5 text-blue-500">
                  •
                </span>
                <span>{condition.label}</span>
              </li>
            ))}
          </ul>
          <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-slate-100 pt-4 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={gateConfirmed}
              onChange={(event) => setGateConfirmed(event.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>我符合以上全部条件。</span>
          </label>
        </div>

        <details className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <summary className="cursor-pointer font-medium">
            有条件不符合？
          </summary>
          <ul className="mt-3 space-y-3">
            {IDENTITY_GATE_CONDITIONS.map((condition) => (
              <li key={condition.id}>
                <p className="font-medium">{condition.label}</p>
                <p className="mt-0.5 leading-relaxed">
                  {condition.unsupportedHint}
                </p>
              </li>
            ))}
          </ul>
        </details>
      </fieldset>

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        确认身份，去选择国家 →
      </button>
    </div>
  );
}
