import type { FlowTask, TaskState } from "@/lib/flow-types";

const kindLabels = {
  required: "必做",
  recommended: "建议",
  conditional: "视情况",
  informational: "阅读确认",
} as const;

type ChecklistItemCardProps = {
  task: FlowTask;
  state?: TaskState;
  onChange: (state: TaskState | null) => void;
};

export function ChecklistItemCard({
  task,
  state,
  onChange,
}: ChecklistItemCardProps) {
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
        </span>
      </label>
      {task.kind !== "required" ? (
        <button
          type="button"
          onClick={() => onChange(state === "skipped" ? null : "skipped")}
          className="mt-3 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
        >
          {state === "skipped" ? "取消跳过" : "暂时跳过 / 不适用"}
        </button>
      ) : null}
    </li>
  );
}
