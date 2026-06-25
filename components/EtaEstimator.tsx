"use client";

import { estimateEta } from "@/lib/domain/eta";
import type { EtaStage, OfficialSource } from "@/lib/flow-types";

type EtaEstimatorProps = {
  stages: EtaStage[];
  submitDate: string;
  onChangeDate: (date: string) => void;
  processingTimesSource?: OfficialSource;
};

const basisLabels = {
  official: "官方",
  experience: "经验",
} as const;

export function EtaEstimator({
  stages,
  submitDate,
  onChangeDate,
  processingTimesSource,
}: EtaEstimatorProps) {
  const estimate = estimateEta(submitDate, stages);

  return (
    <section
      aria-labelledby="eta-title"
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
    >
      <h2 id="eta-title" className="text-sm font-semibold text-emerald-950">
        大致拿签时间（估算）
      </h2>

      <label
        htmlFor="eta-submit-date"
        className="mt-3 block text-xs font-medium text-emerald-900"
      >
        计划在线提交日期
      </label>
      <input
        id="eta-submit-date"
        type="date"
        value={submitDate}
        onChange={(event) => onChangeDate(event.target.value)}
        className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-950"
      />

      {estimate ? (
        <p className="mt-3 text-sm leading-relaxed text-emerald-950">
          若在 <span className="font-medium">{estimate.submitDate}</span> 提交，预计约在{" "}
          <span className="font-medium">{estimate.minDate}</span> 至{" "}
          <span className="font-medium">{estimate.maxDate}</span> 收到贴签护照（约{" "}
          {estimate.totalMinDays}–{estimate.totalMaxDays} 天，常见约 3–6 周）。
        </p>
      ) : (
        <p className="mt-3 text-sm text-emerald-900">请选择一个有效日期以查看估算。</p>
      )}

      {estimate ? (
        <ul className="mt-3 space-y-2">
          {estimate.stages.map((stage) => (
            <li
              key={stage.id}
              className="rounded-lg border border-emerald-200 bg-white p-3 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">{stage.label}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-800">
                  {basisLabels[stage.basis]}
                </span>
                <span className="text-slate-500">
                  约 {stage.minDays}–{stage.maxDays} 天
                </span>
              </div>
              {stage.note ? (
                <p className="mt-1 leading-relaxed text-slate-500">{stage.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-xs leading-relaxed text-emerald-900">
        仅为估算、非保证、非最长上限。官方处理时间只覆盖审批本身，<strong>不含</strong>生物信息采集与护照邮寄；实际以官方查询工具当日显示为准。
      </p>

      {processingTimesSource ? (
        <a
          href={processingTimesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[44px] items-center text-xs font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950"
        >
          查询官方处理时间（{processingTimesSource.organization}）↗
          <span className="sr-only">（在新标签页打开）</span>
        </a>
      ) : null}
    </section>
  );
}
