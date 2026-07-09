"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { FlowConfig } from "@/lib/flow-types";
import { getStepPath } from "@/lib/flows";

type FlowProgressProps = {
  flow: FlowConfig;
  currentStepIndex: number;
  completionPercentage: number;
};

/**
 * 全程里程碑进度条：第一步就能看到从「了解流程」到「收到签证」的全部节点，
 * 已完成 / 当前 / 未到 三种状态，节点可点击跳转；移动端横向滚动并自动居中当前节点。
 */
export function FlowProgress({
  flow,
  currentStepIndex,
  completionPercentage,
}: FlowProgressProps) {
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

  return (
    <section
      aria-label="流程进度"
      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
    >
      <ol
        ref={trackRef}
        className="flex items-start gap-0 overflow-x-auto pb-1 [scrollbar-width:thin]"
      >
        {flow.steps.map((step, index) => {
          const state =
            index < currentStepIndex
              ? "done"
              : index === currentStepIndex
                ? "current"
                : "todo";
          return (
            <li
              key={step.id}
              ref={state === "current" ? currentRef : undefined}
              className="flex shrink-0 items-start"
            >
              {index > 0 ? (
                <span
                  aria-hidden
                  className={`mt-[13px] h-0.5 w-4 sm:w-6 ${
                    index <= currentStepIndex ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              ) : null}
              <Link
                href={getStepPath(flow, step.slug)}
                aria-current={state === "current" ? "step" : undefined}
                className="group flex w-14 flex-col items-center gap-1.5 sm:w-16"
              >
                <span
                  aria-hidden
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                    state === "done"
                      ? "bg-blue-600 text-white"
                      : state === "current"
                        ? "bg-white text-blue-700 ring-2 ring-blue-600"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  {state === "done" ? "✓" : index + 1}
                </span>
                <span
                  className={`text-center text-[11px] leading-tight ${
                    state === "current"
                      ? "font-semibold text-blue-700"
                      : state === "done"
                        ? "text-slate-600"
                        : "text-slate-500"
                  }`}
                >
                  {step.milestone}
                </span>
                <span className="sr-only">
                  {state === "done"
                    ? "（已完成）"
                    : state === "current"
                      ? "（当前步骤）"
                      : "（未开始）"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          第 {currentStepIndex + 1} / {flow.steps.length} 步
        </span>
        <span>
          本站流程完成度 {completionPercentage}%
          <span className="ml-1 text-[11px] text-slate-500">（仅统计必做项）</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-[width]"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </section>
  );
}
