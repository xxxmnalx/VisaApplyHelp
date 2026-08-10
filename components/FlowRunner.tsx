"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BoundaryNote } from "@/components/BoundaryNote";
import { BrandMark } from "@/components/BrandMark";
import { ChecklistItemCard } from "@/components/ChecklistItemCard";
import { DeadlineChip } from "@/components/DeadlineChip";
import { EtaEstimator } from "@/components/EtaEstimator";
import { FlowOverviewPanel } from "@/components/FlowOverviewPanel";
import { FlowProgress } from "@/components/FlowProgress";
import { PrivacyClearFooter } from "@/components/PrivacyClearFooter";
import { VerifiedChip } from "@/components/VerifiedChip";
import { getIdentityOption } from "@/config/identities";
import { deadlineDateFrom, todayDateOnly } from "@/lib/domain/eta";
import { useFlowProgress } from "@/hooks/useFlowProgress";
import { visaapplyPath } from "@/lib/routes";
import type { FlowConfig, FlowStep, OfficialSource } from "@/lib/flow-types";
import {
  getOrganizationShortName,
  getStepPath,
  getTaskSources,
} from "@/lib/flows";

type FlowRunnerProps = {
  flow: FlowConfig;
  step: FlowStep;
  sources: OfficialSource[];
  previousSlug: string | null;
  nextSlug: string | null;
};

/**
 * 屏 2 · 流程页：页头（返回 + 国家 + 身份 chip）→ 里程碑条 → 当前步卡
 * （眉标 / Checklist / 唯一实心主按钮 = 官方入口 / 边界声明 + 核验 chip）→ 其余节点。
 * 桌面为 1fr + 320px 右栏（本步来源 / 后程期限 / 隐私）。
 */
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
    if (isLoaded && !isIdentityValid) router.replace(visaapplyPath("/start"));
  }, [isIdentityValid, isLoaded, router]);

  const currentIndex = flow.steps.findIndex(
    (candidate) => candidate.id === step.id,
  );
  const identityShortLabel =
    getIdentityOption(flow.status)?.shortLabel ?? flow.statusLabel;
  const processingTimesSource = flow.sources.find(
    (source) => source.id === (flow.processingTimeSourceId ?? "processing-times"),
  );

  // 本步 Checklist 完成数：不适用项从分母剔除。
  const stepTaskStates = step.tasks.map(
    (task) => progress.taskStates[`${step.id}:${task.id}`],
  );
  const doneCount = stepTaskStates.filter(
    (state) => state === "completed",
  ).length;
  const totalCount = stepTaskStates.filter(
    (state) => state !== "not-applicable",
  ).length;

  // 唯一实心主按钮：本步第一个非第三方来源作为官方入口。
  const primarySource = sources.find(
    (source) =>
      !source.organization.includes("第三方") &&
      !source.organization.includes("非官方"),
  );

  // 后程期限：全流程带死线的步骤；已录入触发日期且期限天数已核验时给出到期日。
  const deadlineSteps = flow.steps
    .map((candidate, index) => ({ step: candidate, index }))
    .filter(
      (
        entry,
      ): entry is { step: FlowStep & { deadline: NonNullable<FlowStep["deadline"]> }; index: number } =>
        Boolean(entry.step.deadline),
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
      <p className="mx-auto mt-8 max-w-md rounded-xl border border-line bg-white p-4 text-sm text-ink-soft shadow-card">
        正在加载你的申请流程……
      </p>
    );
  }

  return (
    <div>
      {/* 页头：移动端 = 返回 + 国家标题 + 身份 chip；桌面 = 品牌 / 面包屑 / 身份 chip */}
      <header className="border-b border-line-soft bg-white">
        <div className="flex items-center gap-2 px-4 py-3 sm:hidden">
          <Link
            href={visaapplyPath("/start")}
            aria-label="返回身份与国家选择"
            className="-ml-1 px-1 py-1 text-base leading-none text-ink-mute no-underline hover:text-ink hover:no-underline"
          >
            ‹
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
            {flow.countryFlag} {flow.countryName} · {flow.visaType}
          </h1>
          <span className="flex-none rounded-full border border-pine-edge bg-pine-tint px-2.5 py-0.5 font-mono text-[11px] text-pine">
            {identityShortLabel}
          </span>
        </div>
        <div className="mx-auto hidden max-w-5xl items-center gap-3 px-6 py-3.5 sm:flex">
          <Link
            href={visaapplyPath()}
            className="flex items-center gap-2 text-sm font-bold text-ink no-underline hover:no-underline"
          >
            <BrandMark size={18} />
            签证步骤助手
          </Link>
          <span aria-hidden className="text-node-dash">
            /
          </span>
          <Link
            href={visaapplyPath("/start")}
            className="text-[13.5px] text-ink-soft no-underline hover:text-ink hover:no-underline"
          >
            {flow.countryFlag} {flow.countryName} · {flow.visaType}
          </Link>
          <span className="flex-1" />
          <span className="rounded-full border border-pine-edge bg-pine-tint px-2.5 py-1 font-mono text-[11px] text-pine">
            适用身份 {identityShortLabel}
          </span>
        </div>
      </header>

      {/* 里程碑进度条 */}
      <div className="border-b border-line-soft bg-white pb-3 pt-4 sm:pb-4 sm:pt-5">
        <div className="mx-auto max-w-5xl sm:px-6">
          <FlowProgress flow={flow} currentStepIndex={currentIndex} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-5">
        {/* 主列 */}
        <div className="min-w-0">
          <section
            aria-labelledby="current-step-title"
            className="overflow-hidden rounded-xl border border-line bg-white shadow-card"
          >
            <div className="border-b border-line-faint p-3.5 pb-3 sm:p-5 sm:pb-3.5">
              <p className="text-[11px] font-semibold tracking-wider text-pine">
                当前 · 第 {currentIndex + 1} 步
              </p>
              <h2
                id="current-step-title"
                className="mt-1 text-base font-semibold leading-snug text-ink sm:text-[19px]"
              >
                {step.title}
              </h2>
              <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-ink-soft sm:text-[13px] sm:leading-[1.7]">
                {step.summary}
              </p>
            </div>

            {step.showSummaryPanel ? (
              <FlowOverviewPanel
                officialFee={flow.officialFee}
                biometricsFee={flow.biometricsFee}
                feeItems={flow.feeItems}
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

            <div className="flex items-baseline justify-between px-3.5 pb-2 pt-2.5 sm:px-5 sm:pt-3">
              <h3 className="text-[13px] font-semibold text-ink sm:text-[13.5px]">
                本步 Checklist
              </h3>
              <p className="text-[11px] text-ink-mute">
                已完成 <span className="font-mono text-pine">{doneCount}</span> /{" "}
                <span className="font-mono">{totalCount}</span>
              </p>
            </div>
            <ul className="divide-y divide-line-faint border-t border-line-faint">
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

            {step.timelineEvents && step.timelineEvents.length > 0 ? (
              <div className="border-t border-line-faint p-3.5 sm:p-5">
                <p className="text-xs leading-relaxed text-ink-mute">
                  记录关键日期可估算你自己的耗时。日期只保存在当前浏览器。
                </p>
                {step.timelineEvents.map((timelineEvent) => (
                  <div key={timelineEvent.id} className="mt-3">
                    <label
                      htmlFor={timelineEvent.id}
                      className="text-[13px] font-medium text-ink"
                    >
                      {timelineEvent.label}
                    </label>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-faint">
                      {timelineEvent.description}
                    </p>
                    <input
                      id={timelineEvent.id}
                      type="date"
                      value={progress.timelineDates[timelineEvent.id] ?? ""}
                      onChange={(event) =>
                        updateTimelineDate(timelineEvent.id, event.target.value)
                      }
                      className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-sm text-ink"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="border-t border-line-faint p-3.5 sm:p-5">
              {primarySource ? (
                <a
                  href={primarySource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg bg-pine px-4 py-3 text-center text-[14.5px] font-semibold text-white no-underline transition hover:bg-pine-deep hover:no-underline"
                >
                  打开 {getOrganizationShortName(primarySource.organization)}{" "}
                  官方入口 ↗
                  <span className="sr-only">
                    （{primarySource.label}，在新标签页打开）
                  </span>
                </a>
              ) : null}
              <div
                className={`flex items-center justify-between gap-2.5 ${
                  primarySource ? "mt-2.5" : ""
                }`}
              >
                <BoundaryNote />
                <span className="flex-none">
                  <VerifiedChip date={flow.lastVerified} label={null} />
                </span>
              </div>
            </div>
          </section>

          {/* 其余节点 */}
          <h3 className="mx-0.5 mb-2 mt-5 text-xs font-semibold tracking-wider text-ink-mute">
            其余节点
          </h3>
          <section
            aria-label="其余流程节点"
            className="overflow-hidden rounded-xl border border-line bg-white shadow-card"
          >
            <ul className="divide-y divide-line-faint">
              {flow.steps.map((other, index) => {
                if (index === currentIndex) return null;
                if (index < currentIndex) {
                  return (
                    <li key={other.id}>
                      <Link
                        href={getStepPath(flow, other.slug)}
                        className="flex items-center gap-2.5 px-3.5 py-3 no-underline transition hover:bg-[#FAFAF6] hover:no-underline sm:px-5"
                      >
                        <span
                          aria-hidden
                          className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-pine text-[10px] text-white"
                        >
                          ✓
                        </span>
                        <span className="min-w-0 flex-1 text-[13px] text-ink-soft">
                          {index + 1} · {other.title}
                        </span>
                        <span className="flex-none text-[11px] text-pine">
                          回看
                        </span>
                      </Link>
                    </li>
                  );
                }
                return (
                  <li
                    key={other.id}
                    className="flex items-start gap-2.5 px-3.5 py-3 sm:px-5"
                  >
                    <span
                      aria-hidden
                      className="flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] border-node-edge text-[10.5px] text-ink-mute"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] text-ink-soft">
                        {other.title}
                      </span>
                      {other.deadline ? (
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-deadline-ink">
                          {other.deadline.note}
                        </span>
                      ) : null}
                    </span>
                    {other.deadline ? (
                      <span className="mt-0.5 flex-none">
                        <DeadlineChip label={other.deadline.chip} />
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 步骤导航：实心只留给官方入口，前后步用描边按钮 */}
          <nav aria-label="流程步骤导航" className="mt-4 grid grid-cols-2 gap-2.5">
            {previousSlug ? (
              <Link
                href={getStepPath(flow, previousSlug)}
                className="rounded-lg border border-line bg-white px-4 py-3 text-center text-[13px] font-medium text-ink no-underline transition hover:border-node-box hover:no-underline"
              >
                ← 上一步
              </Link>
            ) : (
              <Link
                href={visaapplyPath("/start")}
                className="rounded-lg border border-line bg-white px-4 py-3 text-center text-[13px] font-medium text-ink no-underline transition hover:border-node-box hover:no-underline"
              >
                ← 重选国家
              </Link>
            )}
            {nextSlug ? (
              <Link
                href={getStepPath(flow, nextSlug)}
                className="rounded-lg border border-pine bg-white px-4 py-3 text-center text-[13px] font-semibold text-pine no-underline transition hover:bg-pine-tint hover:no-underline"
              >
                下一步 →
              </Link>
            ) : (
              <Link
                href={visaapplyPath()}
                className="rounded-lg border border-pine bg-white px-4 py-3 text-center text-[13px] font-semibold text-pine no-underline transition hover:bg-pine-tint hover:no-underline"
              >
                完成流程 →
              </Link>
            )}
          </nav>

          <div className="mt-6 px-0.5 lg:hidden">
            <PrivacyClearFooter onClear={() => void handleResetProgress()} />
          </div>
        </div>

        {/* 右栏（移动端堆叠在主列后） */}
        <aside className="mt-4 flex flex-col gap-3.5 lg:mt-0">
          {sources.length > 0 ? (
            <section
              aria-labelledby="sources-title"
              className="rounded-xl border border-line bg-white p-4 shadow-card"
            >
              <h3 id="sources-title" className="text-xs font-semibold text-ink">
                本步来源
              </h3>
              <p className="mt-2">
                <VerifiedChip date={flow.lastVerified} />
              </p>
              <ul className="mt-2.5 space-y-2">
                {sources.map((source) => (
                  <li key={source.id} className="text-xs leading-relaxed">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pine hover:text-pine-deep"
                    >
                      {getOrganizationShortName(source.organization)} —{" "}
                      {source.label} ↗
                    </a>
                    <span className="mt-0.5 block text-[10.5px] text-ink-faint">
                      {source.organization} · 核验于{" "}
                      <span className="font-mono">{source.lastVerified}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-[11px] leading-relaxed text-ink-faint">
                外部页面可能更新；请以打开后的官方页面为准。
              </p>
            </section>
          ) : null}

          {deadlineSteps.length > 0 ? (
            <section
              aria-labelledby="deadlines-title"
              className="rounded-xl border border-line bg-white p-4 shadow-card"
            >
              <h3 id="deadlines-title" className="text-xs font-semibold text-ink">
                后程期限 · 可追踪
              </h3>
              {deadlineSteps.map(({ step: deadlineStep, index }) => {
                const triggerDate = deadlineStep.deadline.eventId
                  ? progress.timelineDates[deadlineStep.deadline.eventId]
                  : undefined;
                const dueDate =
                  triggerDate && deadlineStep.deadline.days
                    ? deadlineDateFrom(triggerDate, deadlineStep.deadline.days)
                    : null;
                return (
                  <div
                    key={deadlineStep.id}
                    className="mt-2.5 flex items-start gap-2"
                  >
                    <span className="mt-px flex-none">
                      <DeadlineChip label={deadlineStep.deadline.chip} />
                    </span>
                    <p className="text-xs leading-relaxed text-ink-soft">
                      第 <span className="font-mono">{index + 1}</span> 步 ·{" "}
                      {deadlineStep.deadline.note}
                      {dueDate ? (
                        <>
                          ；到期日{" "}
                          <span className="font-mono text-ink">{dueDate}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                );
              })}
              <p className="mt-2.5 text-[11px] leading-relaxed text-ink-faint">
                到达对应节点、录入收信日期后，此处显示具体到期日。
              </p>
            </section>
          ) : null}

          <section className="hidden rounded-xl border border-line bg-white p-4 shadow-card lg:block">
            <p className="text-xs leading-relaxed text-ink-mute">
              进度只保存在这台设备的浏览器里，不上传任何服务器。
            </p>
            <button
              type="button"
              onClick={() => void handleResetProgress()}
              className="mt-2.5 inline-block rounded-lg border border-danger-edge bg-white px-3 py-2 text-xs text-danger transition hover:bg-danger-fill"
            >
              清除全部数据
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
