"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChecklistItemCard } from "@/components/ChecklistItemCard";
import { FlowProgress } from "@/components/FlowProgress";
import { OfficialLinkCard } from "@/components/OfficialLinkCard";
import { useFlowProgress } from "@/hooks/useFlowProgress";
import {
  calculateCompletionPercentage,
  countMissingRequiredTasks,
} from "@/lib/domain/progress";
import type {
  FlowConfig,
  FlowStep,
  OfficialSource,
} from "@/lib/flow-types";
import { getStepPath } from "@/lib/flows";

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

  async function handleResetProgress() {
    if (!window.confirm("确定清除这条流程在当前浏览器中的全部进度吗？")) return;
    await resetProgress();
  }

  if (!isLoaded || !isIdentityValid) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        正在加载你的申请流程……
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <FlowProgress
        currentStep={currentIndex + 1}
        totalSteps={flow.steps.length}
        completionPercentage={completionPercentage}
      />

      <header>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
            {flow.statusLabel}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {flow.countryName} · {flow.visaType}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          {step.title}
        </h1>
        <p className="mt-2 leading-relaxed text-slate-600">{step.summary}</p>
      </header>

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
              onChange={(state) => updateTask(step.id, task.id, state)}
            />
          ))}
        </ul>
      </section>

      {step.timelineEvent ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <label
            htmlFor={step.timelineEvent.id}
            className="text-sm font-medium text-violet-950"
          >
            {step.timelineEvent.label}
          </label>
          <p className="mt-1 text-xs leading-relaxed text-violet-800">
            {step.timelineEvent.description} 日期只保存在当前浏览器。
          </p>
          <input
            id={step.timelineEvent.id}
            type="date"
            value={progress.timelineDates[step.timelineEvent.id] ?? ""}
            onChange={(event) =>
              updateTimelineDate(step.timelineEvent!.id, event.target.value)
            }
            className="mt-3 w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-950"
          />
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
            href="/start"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            ← 重新选择
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
        清除当前浏览器中的流程进度
      </button>
    </div>
  );
}
