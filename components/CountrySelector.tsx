"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIdentityOption } from "@/config/identities";
import type { FlowConfig, UserIdentitySelection } from "@/lib/flow-types";
import { getStepPath, listFlowsForStatus } from "@/lib/flows";
import {
  LocalFlowProgressRepository,
  LocalUserIdentityRepository,
} from "@/lib/repositories/local-flow-repository";

/**
 * 国家选择页：身份确认之后的第二站。
 * 列出当前身份可申请的国家流程卡片，卡片上预览全部里程碑节点。
 */
export function CountrySelector() {
  const router = useRouter();
  const [identity, setIdentity] = useState<UserIdentitySelection | null>(null);
  const [flows, setFlows] = useState<FlowConfig[]>([]);
  const [resumeStepSlugs, setResumeStepSlugs] = useState<Map<string, string>>(
    new Map(),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function load() {
      const saved = await new LocalUserIdentityRepository().load();
      if (!isActive) return;

      if (!saved?.consentAcceptedAt) {
        router.replace("/start");
        return;
      }

      const availableFlows = listFlowsForStatus(saved.statusCode);
      if (availableFlows.length === 0) {
        router.replace("/start");
        return;
      }

      // 已有本地进度的流程：按钮区分「继续」与「开始」，且继续时回到上次所在步骤。
      const progressRepository = new LocalFlowProgressRepository();
      const savedProgress = await Promise.all(
        availableFlows.map(async (flow) => {
          const progress = await progressRepository.load(flow);
          // 用户零操作的空记录（revision 0 且无任务/日期）不算「进行中」。
          const hasRealProgress =
            progress &&
            (progress.revision > 0 ||
              Object.keys(progress.taskStates).length > 0 ||
              Object.keys(progress.timelineDates).length > 0);
          const resumeStep = hasRealProgress
            ? flow.steps.find((step) => step.id === progress.currentStepId)
            : undefined;
          return {
            flowId: flow.id,
            resumeSlug: resumeStep?.slug ?? (hasRealProgress ? flow.steps[0].slug : null),
          };
        }),
      );
      if (!isActive) return;

      setIdentity(saved);
      setFlows(availableFlows);
      setResumeStepSlugs(
        new Map(
          savedProgress
            .filter((entry) => entry.resumeSlug)
            .map((entry) => [entry.flowId, entry.resumeSlug as string]),
        ),
      );
      setIsLoaded(true);
    }

    void load();
    return () => {
      isActive = false;
    };
  }, [router]);

  if (!isLoaded || !identity) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        正在加载可用的国家流程……
      </p>
    );
  }

  const identityOption = getIdentityOption(identity.statusCode);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
          当前身份：{identityOption?.label ?? identity.statusCode}
        </span>
        <Link
          href="/start"
          className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
        >
          更换身份
        </Link>
      </div>

      <div className="space-y-4">
        {flows.map((flow) => {
          const resumeSlug = resumeStepSlugs.get(flow.id) ?? null;
          const hasProgress = resumeSlug !== null;
          return (
            <article
              key={flow.id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                      <span aria-hidden className="text-2xl">
                        {flow.countryFlag}
                      </span>
                      {flow.countryName} · {flow.visaType}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {flow.audience}
                    </p>
                  </div>
                  {hasProgress ? (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                      进行中
                    </span>
                  ) : null}
                </div>

                <ol
                  aria-label={`${flow.countryName}流程节点`}
                  className="mt-4 flex flex-wrap items-center gap-y-1.5 text-[11px] text-slate-500"
                >
                  {flow.steps.map((step, index) => (
                    <li key={step.id} className="flex items-center">
                      {index > 0 ? (
                        <span aria-hidden className="mx-1 text-slate-300">
                          →
                        </span>
                      ) : null}
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5">
                        {step.milestone}
                      </span>
                    </li>
                  ))}
                </ol>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-slate-500">官方申请费</dt>
                    <dd className="mt-0.5 font-medium leading-relaxed text-slate-800">
                      {flow.officialFee}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">步骤</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">
                      {flow.steps.length} 步
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">最近核验</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">
                      {flow.lastVerified}
                    </dd>
                  </div>
                </dl>
              </div>
              <Link
                href={getStepPath(flow, resumeSlug ?? flow.steps[0].slug)}
                className="block bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-800"
              >
                {hasProgress ? "继续这条流程 →" : "开始这条流程 →"}
              </Link>
            </article>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        费用与要求以各官方页面为准；卡片上的核验日期表示本站最近一次对照官方页面的时间。
      </p>
    </div>
  );
}
