"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { DeadlineChip } from "@/components/DeadlineChip";
import { averageEtaLabel } from "@/lib/domain/eta";
import type { FlowConfig } from "@/lib/flow-types";
import { getStepPath } from "@/lib/flows";

type FlowProgressProps = {
  flow: FlowConfig;
  currentStepIndex: number;
};

/**
 * 里程碑进度条（视觉签名）：第 1 步起全部节点可见——「地图已画好」。
 * 完成 = 实心杉绿 + 勾；当前 = 放大 + 4px 浅绿环 + 标签加粗；未来 = 空心数字；
 * 死线节点 = 琥珀 chip 常驻，不倒数。已完成节点可点回看，未来节点不可跳。
 * 移动端横向滚动、当前节点自动居中；条下一行给出全程平均 ETA。
 */
export function FlowProgress({ flow, currentStepIndex }: FlowProgressProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const current = currentRef.current;
    if (!track || !current) return;
    // 只滚动进度条容器自身，不影响页面纵向位置；
    // 用 getBoundingClientRect 计算相对轨道的偏移（li 无定位祖先，offsetLeft 相对 body 不可用）。
    const trackRect = track.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    track.scrollLeft +=
      currentRect.left -
      trackRect.left -
      track.clientWidth / 2 +
      currentRect.width / 2;
  }, [currentStepIndex]);

  const etaLabel = averageEtaLabel(flow.etaStages);

  return (
    <section aria-label="流程进度">
      <ol
        ref={trackRef}
        className="relative flex overflow-x-auto px-2 pb-1 [scrollbar-width:thin] sm:px-0"
      >
        {flow.steps.map((step, index) => {
          const state =
            index < currentStepIndex
              ? "done"
              : index === currentStepIndex
                ? "current"
                : "future";

          const dot = (
            <span
              aria-hidden
              className={`flex flex-none items-center justify-center rounded-full font-semibold ${
                state === "done"
                  ? "h-[26px] w-[26px] bg-pine text-xs text-white"
                  : state === "current"
                    ? "h-[30px] w-[30px] bg-pine text-[13px] text-white ring-4 ring-pine-tint"
                    : "h-[26px] w-[26px] border-[1.5px] border-node-edge bg-white text-xs text-ink-mute"
              }`}
            >
              {state === "done" ? "✓" : index + 1}
            </span>
          );

          const column = (
            <>
              <span aria-hidden className="flex items-center self-stretch">
                <span
                  className={`h-0.5 min-w-[6px] flex-1 ${
                    index === 0
                      ? "bg-transparent"
                      : index <= currentStepIndex
                        ? "bg-pine"
                        : "bg-node-track"
                  }`}
                />
                {dot}
                <span
                  className={`h-0.5 min-w-[6px] flex-1 ${
                    index === flow.steps.length - 1
                      ? "bg-transparent"
                      : index < currentStepIndex
                        ? "bg-pine"
                        : "bg-node-track"
                  }`}
                />
              </span>
              <span
                className={`mt-2 px-1 text-center leading-snug ${
                  state === "current"
                    ? "text-[11.5px] font-semibold text-ink"
                    : state === "done"
                      ? "text-[11px] text-ink-soft"
                      : "text-[11px] text-ink-mute"
                }`}
              >
                {step.milestone}
              </span>
              {step.deadline ? (
                <span className="mt-1">
                  <DeadlineChip label={step.deadline.chip} />
                </span>
              ) : null}
              <span className="sr-only">
                {state === "done"
                  ? "（已完成，点击回看）"
                  : state === "current"
                    ? "（当前步骤）"
                    : "（未开始）"}
              </span>
            </>
          );

          return (
            <li
              key={step.id}
              ref={state === "current" ? currentRef : undefined}
              className="w-[92px] flex-none sm:w-auto sm:flex-1"
            >
              {state === "future" ? (
                <span className="flex flex-col items-center">{column}</span>
              ) : (
                <Link
                  href={getStepPath(flow, step.slug)}
                  aria-current={state === "current" ? "step" : undefined}
                  className="flex flex-col items-center no-underline hover:no-underline"
                >
                  {column}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <p className="px-4 pt-2.5 text-[11.5px] text-ink-mute sm:px-0 sm:text-center sm:text-xs">
        第{" "}
        <span className="font-mono text-ink">{currentStepIndex + 1}</span> /{" "}
        <span className="font-mono">{flow.steps.length}</span> 步
        {etaLabel ? (
          <>
            {" "}
            · 全程平均<span className="font-mono text-ink">{etaLabel}</span>
            ，按提交日估算，以官方当日审理进度为准
          </>
        ) : null}
      </p>
    </section>
  );
}
