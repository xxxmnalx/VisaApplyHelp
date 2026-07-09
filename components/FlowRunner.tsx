"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChecklistItemCard } from "@/components/ChecklistItemCard";
import { EtaEstimator } from "@/components/EtaEstimator";
import { FlowOverviewPanel } from "@/components/FlowOverviewPanel";
import { FlowProgress } from "@/components/FlowProgress";
import { OfficialLinkCard } from "@/components/OfficialLinkCard";
import { useFlowProgress } from "@/hooks/useFlowProgress";
import {
  calculateCompletionPercentage,
  countMissingRequiredTasks,
} from "@/lib/domain/progress";
import { todayDateOnly } from "@/lib/domain/eta";
import type {
  FlowConfig,
  FlowStep,
  OfficialSource,
} from "@/lib/flow-types";
import { getStepPath, getTaskSources } from "@/lib/flows";

type FlowRunnerProps = {
  flow: FlowConfig;
  step: FlowStep;
  sources: OfficialSource[];
  previousSlug: string | null;
  nextSlug: string | null;
};

export function FlowRunner({
  flow,
  step,
  sources,
  previousSlug,
  nextSlug,
}: FlowRunnerProps) {
  const router = useRouter();
  const {
    isLoaded,
    isIdentityValid,
    progress,
    updateTask,
    updateTimelineDate,
    resetProgress,
  } = useFlowProgress(flow, step.id);

  useEffect(() => {
    if (isLoaded && !isIdentityValid) router.replace("/start");
  }, [isIdentityValid, isLoaded, router]);

  const completionPercentage = calculateCompletionPercentage(flow, progress);
  const currentIndex = flow.steps.findIndex((candidate) => candidate.id === step.id);
  const missingRequired = countMissingRequiredTasks(step, progress);
  const processingTimesSource = flow.sources.find(
    (source) => source.id === (flow.processingTimeSourceId ?? "processing-times"),
  );

  async function handleResetProgress() {
    if (
      !window.confirm(
        "确定清除本站在当前浏览器保存的全部数据吗？（身份选择与所有国家的流程进度都会被删除）",
      )
    )
      return;
    // 清除后 isIdentityValid 变为 false，由上方失效跳转 effect 统一回到 /start。
    await resetProgress();
  }

  if (!isLoaded || !isIdentityValid) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        正在加载你的申请流程……
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <FlowProgress
        flow={flow}
        currentStepIndex={currentIndex}
        completionPercentage={completionPercentage}
      />

      <header>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
            {flow.statusLabel}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {flow.countryFlag} {flow.countryName} · {flow.visaType}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          {step.title}
        </h1>
        <p className="mt-2 leading-relaxed text-slate-600">{step.summary}</p>
      </header>

      {step.showSummaryPanel ? (
        <FlowOverviewPanel
          officialFee={flow.officialFee}
          biometricsFee={flow.biometricsFee}
          lastVerified={flow.lastVerified}
          processingTimesSource={processingTimesSource}
        />
      ) : null}

      {step.showEtaEstimator ? (
        <EtaEstimator
          stages={flow.etaStages}
          submitDate={progress.timelineDates.etaSubmitDate ?? todayDateOnly()}
          onChangeDate={(date) => updateTimelineDate("etaSubmitDate", date)}
          processingTimesSource={processingTimesSource}
        />
      ) : null}

      <section aria-labelledby="checklist-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="checklist-title" className="text-lg font-semibold text-slate-950">
            本步骤 Checklist
          </h2>
          <span className="text-xs text-slate-500">
            {missingRequired > 0 ? `${missingRequired} 项必做未完成` : "必做项已完成"}
          </span>
        </div>
        <ul className="mt-3 space-y-3">
          {step.tasks.map((task) => (
            <ChecklistItemCard
              key={task.id}
              task={task}
              state={progress.taskStates[`${step.id}:${task.id}`]}
              sources={getTaskSources(flow, task)}
              onChange={(state) => updateTask(step.id, task.id, state)}
            />
          ))}
        </ul>
      </section>

      {step.timelineEvents && step.timelineEvents.length > 0 ? (
        <section className="space-y-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs leading-relaxed text-violet-800">
            记录关键日期可估算你自己的耗时。日期只保存在当前浏览器。
          </p>
          {step.timelineEvents.map((timelineEvent) => (
            <div key={timelineEvent.id}>
              <label
                htmlFor={timelineEvent.id}
                className="text-sm font-medium text-violet-950"
              >
                {timelineEvent.label}
              </label>
              <p className="mt-1 text-xs leading-relaxed text-violet-800">
                {timelineEvent.description}
              </p>
              <input
                id={timelineEvent.id}
                type="date"
                value={progress.timelineDates[timelineEvent.id] ?? ""}
                onChange={(event) =>
                  updateTimelineDate(timelineEvent.id, event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-950"
              />
            </div>
          ))}
        </section>
      ) : null}

      {sources.length > 0 ? (
        <section aria-labelledby="sources-title">
          <h2 id="sources-title" className="text-lg font-semibold text-slate-950">
            官方入口与来源
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            外部页面可能更新；请以打开后的官方页面为准。
          </p>
          <div className="mt-3 space-y-3">
            {sources.map((source) => (
              <OfficialLinkCard key={source.id} source={source} />
            ))}
          </div>
        </section>
      ) : null}

      <nav aria-label="流程步骤导航" className="grid grid-cols-2 gap-3">
        {previousSlug ? (
          <Link
            href={getStepPath(flow, previousSlug)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            ← 上一步
          </Link>
        ) : (
          <Link
            href="/countries"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            ← 重选国家
          </Link>
        )}
        {nextSlug ? (
          <Link
            href={getStepPath(flow, nextSlug)}
            className="rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-800"
          >
            下一步 →
          </Link>
        ) : (
          <Link
            href="/"
            className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-medium text-white hover:bg-emerald-800"
          >
            完成流程
          </Link>
        )}
      </nav>

      <button
        type="button"
        onClick={handleResetProgress}
        className="text-xs text-slate-500 underline underline-offset-2 hover:text-red-700"
      >
        清除本站在此浏览器保存的全部数据
      </button>
    </div>
  );
}
