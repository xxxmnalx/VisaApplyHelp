"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { CountrySelector, type CountryResume } from "@/components/CountrySelector";
import { IdentitySelector } from "@/components/IdentitySelector";
import { PrivacyClearFooter } from "@/components/PrivacyClearFooter";
import { UsageAgreement } from "@/components/UsageAgreement";
import { getIdentityOption } from "@/config/identities";
import type { FlowConfig } from "@/lib/flow-types";
import { listFlowsForStatus } from "@/lib/flows";
import {
  LocalFlowProgressRepository,
  LocalUserIdentityRepository,
  clearAllLocalData,
} from "@/lib/repositories/local-flow-repository";

type StartPhase = "loading" | "agreement" | "select";

/** 某身份可申请的国家流程与各自的断点信息。 */
type CountryData = {
  flows: FlowConfig[];
  resumeByFlowId: Record<string, CountryResume>;
};

async function loadCountryData(statusCode: string): Promise<CountryData> {
  const flows = listFlowsForStatus(statusCode);
  const progressRepository = new LocalFlowProgressRepository();
  const resumeByFlowId: Record<string, CountryResume> = {};

  await Promise.all(
    flows.map(async (flow) => {
      const progress = await progressRepository.load(flow);
      // 用户零操作的空记录（revision 0 且无任务/日期）不算「进行中」。
      const hasRealProgress =
        progress &&
        (progress.revision > 0 ||
          Object.keys(progress.taskStates).length > 0 ||
          Object.keys(progress.timelineDates).length > 0);
      if (!hasRealProgress) return;
      const stepIndex = flow.steps.findIndex(
        (step) => step.id === progress.currentStepId,
      );
      const resumeIndex = stepIndex >= 0 ? stepIndex : 0;
      resumeByFlowId[flow.id] = {
        stepSlug: flow.steps[resumeIndex].slug,
        stepNumber: resumeIndex + 1,
        stepTitle: flow.steps[resumeIndex].title,
      };
    }),
  );

  return { flows, resumeByFlowId };
}

/**
 * 屏 1 · 入口：身份与国家同屏两段完成。
 * 首次访问先过使用须知必读门（含适用条件）；之后信任信号转为小而常驻
 * （顶部一行边界声明、卡上核验 chip、页脚隐私 + 一键清除）。
 */
export function StartFlow() {
  const [phase, setPhase] = useState<StartPhase>("loading");
  const [consentAcceptedAt, setConsentAcceptedAt] = useState<string | null>(
    null,
  );
  const [statusCode, setStatusCode] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      // 回访用户：已同意过须知则直接进入选择屏，并预选上次身份。
      const identity = await new LocalUserIdentityRepository().load();
      if (!isActive) return;
      if (!identity) {
        setPhase("agreement");
        return;
      }
      setConsentAcceptedAt(identity.consentAcceptedAt);
      setStatusCode(identity.statusCode);
      setPhase("select");
      const data = await loadCountryData(identity.statusCode);
      if (!isActive) return;
      setCountryData(data);
    }

    void load();
    return () => {
      isActive = false;
    };
  }, []);

  async function handleSelectIdentity(code: string) {
    if (code === statusCode) return;
    const consent = consentAcceptedAt ?? new Date().toISOString();
    const identityRepository = new LocalUserIdentityRepository();
    await identityRepository.save({
      statusCode: code,
      savedAt: new Date().toISOString(),
      consentAcceptedAt: consent,
    });
    // 浏览器禁用站点数据时保存会静默失败；回读校验，避免选完国家又被弹回。
    const persisted = await identityRepository.load();
    if (persisted?.statusCode !== code) {
      window.alert(
        "你的浏览器禁用了本地存储（Cookie / 站点数据），本站无法保存身份与进度。请在浏览器设置中允许本站数据后重试。",
      );
      return;
    }
    setConsentAcceptedAt(consent);
    setStatusCode(code);
    setCountryData(null);
    const data = await loadCountryData(code);
    setCountryData(data);
  }

  function handleClearAll() {
    if (
      !window.confirm(
        "确定清除本站在当前浏览器保存的全部数据吗？（身份选择与所有国家的流程进度都会被删除）",
      )
    )
      return;
    clearAllLocalData();
    setConsentAcceptedAt(null);
    setStatusCode(null);
    setCountryData(null);
    setPhase("agreement");
  }

  const identityOption = statusCode ? getIdentityOption(statusCode) : null;

  return (
    <main className="flex-1">
      <p className="border-b border-line-soft bg-paper-bright px-4 py-2 text-center text-[11.5px] leading-normal text-ink-mute">
        本站不代办、不接收任何申请材料，所有提交都在官方系统完成
      </p>

      <div className="mx-auto w-full max-w-md px-4 pb-2">
        <div className="flex items-center gap-2 pb-1 pt-5">
          <BrandMark size={20} />
          <div>
            <p className="text-base font-bold leading-tight text-ink">
              签证步骤助手
            </p>
            <p className="text-[11px] text-ink-mute">
              在美中国护照持有人 · 第三国签证
            </p>
          </div>
        </div>

        {phase === "loading" ? (
          <p className="mt-4 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft shadow-card">
            正在加载……
          </p>
        ) : phase === "agreement" ? (
          <UsageAgreement
            onAgree={() => {
              setConsentAcceptedAt(new Date().toISOString());
              setPhase("select");
            }}
          />
        ) : (
          <>
            <section aria-labelledby="identity-title" className="mt-4">
              <h2 id="identity-title" className="text-[15px] font-semibold text-ink">
                ① 确认你的美国身份
              </h2>
              <div className="mt-2.5">
                <IdentitySelector
                  selectedCode={statusCode}
                  onSelect={(code) => void handleSelectIdentity(code)}
                />
              </div>
            </section>

            <section aria-labelledby="country-title" className="mt-6">
              <div className="flex items-baseline justify-between">
                <h2 id="country-title" className="text-[15px] font-semibold text-ink">
                  ② 选择申请国家
                </h2>
                {identityOption ? (
                  <p className="text-[11px] text-ink-mute">
                    按 {identityOption.shortLabel} 身份加载
                  </p>
                ) : null}
              </div>
              {!statusCode ? (
                <p className="mt-2.5 rounded-xl border border-dashed border-node-dash bg-white p-4 text-xs leading-relaxed text-ink-faint">
                  先在上方确认身份，再加载可申请的国家与对应材料清单。
                </p>
              ) : !countryData ? (
                <p className="mt-2.5 rounded-xl border border-line bg-white p-4 text-xs text-ink-soft">
                  正在加载可申请的国家……
                </p>
              ) : (
                <CountrySelector
                  flows={countryData.flows}
                  resumeByFlowId={countryData.resumeByFlowId}
                />
              )}
            </section>

            <div className="mt-8">
              <PrivacyClearFooter onClear={handleClearAll} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
