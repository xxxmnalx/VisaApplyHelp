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

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={state === "completed"}
          onChange={(event) => onChange(event.target.checked ? "completed" : null)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-950">{task.title}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              {kindLabels[task.kind]}
            </span>
          </span>
          {task.description ? (
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">
              {task.description}
            </span>
          ) : null}
          {sources.length > 0 ? (
            <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 underline underline-offset-2 hover:text-blue-900"
                >
                  {source.organization}：{source.label} ↗
                </a>
              ))}
            </span>
          ) : null}
        </span>
      </label>
      {task.detailPoints && task.detailPoints.length > 0 ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-medium text-blue-700 hover:text-blue-900">
            展开详细说明
          </summary>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
            {task.detailPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </details>
      ) : null}
      {canSkip || canMarkNotApplicable ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {canSkip ? (
            <button
              type="button"
              aria-pressed={state === "skipped"}
              aria-label={`暂时跳过：${task.title}`}
              onClick={() => onChange(state === "skipped" ? null : "skipped")}
              className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium transition ${
                state === "skipped"
                  ? "bg-slate-800 text-white ring-2 ring-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {state === "skipped" ? "✓ 已跳过" : "暂时跳过"}
            </button>
          ) : null}
          {canMarkNotApplicable ? (
            <button
              type="button"
              aria-pressed={state === "not-applicable"}
              aria-label={`标记不适用：${task.title}`}
              onClick={() =>
                onChange(state === "not-applicable" ? null : "not-applicable")
              }
              className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium transition ${
                state === "not-applicable"
                  ? "bg-slate-800 text-white ring-2 ring-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {state === "not-applicable" ? "✓ 已标记不适用" : "不适用"}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
