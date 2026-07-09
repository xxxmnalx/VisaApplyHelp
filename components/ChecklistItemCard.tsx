import type { FlowTask, OfficialSource, TaskState } from "@/lib/flow-types";

const kindLabels = {
  required: "必做",
  recommended: "建议",
  conditional: "视情况",
  informational: "阅读确认",
} as const;

type ChecklistItemCardProps = {
  task: FlowTask;
  state?: TaskState;
  sources?: OfficialSource[];
  onChange: (state: TaskState | null) => void;
};

/**
 * Checklist 任务行 · 四态：
 * 待办 = 空框 + 「跳过 / 不适用」文字操作；完成 = 实心杉绿勾（不划线，材料清单仍需回看）；
 * 跳过 = 虚线框保留「未做」痕迹；不适用 = 灰底 ✕，不计入完成度分母。
 * 行内点击框与文字即可勾选；父级用 divide-y 分行。
 */
export function ChecklistItemCard({
  task,
  state,
  sources = [],
  onChange,
}: ChecklistItemCardProps) {
  // 必做项默认不可跳过；仅「有条件才适用」的必做项可标不适用。
  const canSkip = task.kind !== "required";
  const canMarkNotApplicable =
    task.kind !== "required" || Boolean(task.allowNotApplicable);
  const isMutedState = state === "skipped" || state === "not-applicable";

  return (
    <li>
      <div className="flex items-start gap-3 px-3.5 py-3 transition hover:bg-[#FAFAF6] sm:px-5">
        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={state === "completed"}
            onChange={(event) =>
              onChange(event.target.checked ? "completed" : null)
            }
            aria-label={`完成：${task.title}`}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={`mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-[5px] text-xs peer-focus-visible:ring-2 peer-focus-visible:ring-pine peer-focus-visible:ring-offset-1 ${
              state === "completed"
                ? "bg-pine text-white"
                : state === "skipped"
                  ? "border-[1.5px] border-dashed border-node-box text-ink-mute"
                  : state === "not-applicable"
                    ? "border border-node-naedge bg-node-na text-[11px] text-ink-mute"
                    : "border-[1.5px] border-node-box bg-white text-transparent"
            }`}
          >
            {state === "completed"
              ? "✓"
              : state === "skipped"
                ? "–"
                : state === "not-applicable"
                  ? "✕"
                  : ""}
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[14.5px] font-medium leading-[1.55] ${
                  isMutedState ? "text-ink-mute" : "text-ink"
                }`}
              >
                {task.title}
              </span>
              {task.kind !== "required" ? (
                <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10.5px] leading-none text-ink-mute">
                  {kindLabels[task.kind]}
                </span>
              ) : null}
            </span>
            {task.description ? (
              <span className="mt-0.5 block text-[11.5px] leading-normal text-ink-faint">
                {task.description}
              </span>
            ) : null}
          </span>
        </label>

        {state === "skipped" || state === "not-applicable" ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`恢复为待办：${task.title}`}
            title="点击恢复为待办"
            className="mt-0.5 flex-none rounded-full border border-line bg-paper px-2 py-0.5 text-[10.5px] leading-4 text-ink-mute transition hover:border-node-box hover:text-ink"
          >
            {state === "skipped" ? "已跳过" : "不适用"}
          </button>
        ) : state !== "completed" && (canSkip || canMarkNotApplicable) ? (
          <span className="mt-0.5 flex flex-none gap-2.5">
            {canSkip ? (
              <button
                type="button"
                aria-pressed={false}
                aria-label={`暂时跳过：${task.title}`}
                onClick={() => onChange("skipped")}
                className="-my-2 px-1 py-3 text-[11px] text-ink-mute transition hover:text-ink"
              >
                跳过
              </button>
            ) : null}
            {canMarkNotApplicable ? (
              <button
                type="button"
                aria-pressed={false}
                aria-label={`标记不适用：${task.title}`}
                onClick={() => onChange("not-applicable")}
                className="-my-2 px-1 py-3 text-[11px] text-ink-mute transition hover:text-ink"
              >
                不适用
              </button>
            ) : null}
          </span>
        ) : null}
      </div>

      {task.detailPoints && task.detailPoints.length > 0 ? (
        <details className="-mt-1.5 px-3.5 pb-2.5 pl-[46px] sm:px-5 sm:pl-[58px]">
          <summary className="cursor-pointer text-xs font-medium text-pine hover:text-pine-deep">
            展开详细说明
          </summary>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-ink-soft">
            {task.detailPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </details>
      ) : null}

      {sources.length > 0 ? (
        <p className="-mt-1.5 flex flex-wrap gap-x-3 gap-y-1 px-3.5 pb-2.5 pl-[46px] sm:px-5 sm:pl-[58px]">
          {sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-pine underline underline-offset-2 hover:text-pine-deep"
            >
              {source.organization}：{source.label} ↗
            </a>
          ))}
        </p>
      ) : null}
    </li>
  );
}
