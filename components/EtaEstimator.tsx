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

/** 拿签 ETA 估算：嵌在当前步卡内的一节；估算非保证，官方处理段以当日官方工具为准。 */
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
      className="border-b border-line-faint p-3.5 sm:p-5"
    >
      <h2 id="eta-title" className="text-[13px] font-semibold text-ink">
        大致拿签时间（估算）
      </h2>

      <label
        htmlFor="eta-submit-date"
        className="mt-2.5 block text-xs font-medium text-ink-soft"
      >
        计划在线提交日期
      </label>
      <input
        id="eta-submit-date"
        type="date"
        value={submitDate}
        onChange={(event) => onChangeDate(event.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-sm text-ink"
      />

      {estimate ? (
        <p className="mt-2.5 text-[13px] leading-relaxed text-ink">
          若在 <span className="font-mono">{estimate.submitDate}</span>{" "}
          提交，预计约在{" "}
          <span className="font-mono font-semibold">{estimate.minDate}</span> 至{" "}
          <span className="font-mono font-semibold">{estimate.maxDate}</span>{" "}
          之间拿到签证（约{" "}
          <span className="font-mono">
            {estimate.totalMinDays}–{estimate.totalMaxDays}
          </span>{" "}
          天）。
        </p>
      ) : (
        <p className="mt-2.5 text-[13px] text-ink-soft">
          请选择一个有效日期以查看估算。
        </p>
      )}

      {estimate ? (
        <ul className="mt-2.5 space-y-2">
          {estimate.stages.map((stage) => (
            <li key={stage.id} className="text-xs leading-relaxed">
              <span className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10.5px] leading-none text-ink-mute">
                  {basisLabels[stage.basis]}
                </span>
                <span className="font-medium text-ink">{stage.label}</span>
                <span className="font-mono text-ink-mute">
                  约 {stage.minDays}–{stage.maxDays} 天
                </span>
              </span>
              {stage.note ? (
                <span className="mt-0.5 block pl-0.5 text-[11px] text-ink-faint">
                  {stage.note}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2.5 text-[11px] leading-relaxed text-ink-mute">
        仅为估算、非保证、非最长上限。官方处理时间通常只覆盖审理本身，
        <strong>不含</strong>
        补件、预约、邮寄等环节；实际以官方页面当日显示为准。
      </p>

      {processingTimesSource ? (
        <a
          href={processingTimesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex min-h-[44px] items-center text-xs font-medium text-pine underline underline-offset-2 hover:text-pine-deep"
        >
          查询官方处理时间（{processingTimesSource.organization}）↗
          <span className="sr-only">（在新标签页打开）</span>
        </a>
      ) : null}
    </section>
  );
}
