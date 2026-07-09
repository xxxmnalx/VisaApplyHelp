import type { OfficialSource } from "@/lib/flow-types";

type FlowOverviewPanelProps = {
  officialFee: string;
  /** 无生物信息采集环节的国家不传。 */
  biometricsFee?: string;
  lastVerified: string;
  processingTimesSource?: OfficialSource;
};

export function FlowOverviewPanel({
  officialFee,
  biometricsFee,
  lastVerified,
  processingTimesSource,
}: FlowOverviewPanelProps) {
  return (
    <section
      aria-labelledby="overview-panel-title"
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <h2
        id="overview-panel-title"
        className="text-sm font-semibold text-slate-950"
      >
        费用与时间总览
      </h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-slate-500">官方申请费</dt>
          <dd className="mt-0.5 leading-relaxed text-slate-800">
            {officialFee}
          </dd>
        </div>
        {biometricsFee ? (
          <div>
            <dt className="text-xs font-medium text-slate-500">生物信息费</dt>
            <dd className="mt-0.5 leading-relaxed text-slate-800">
              {biometricsFee}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-medium text-slate-500">
            本站用户时间线
          </dt>
          <dd className="mt-0.5 leading-relaxed text-slate-500">
            数据收集中：样本不足时不展示统计，且始终与官方处理时间分开标注。
          </dd>
        </div>
      </dl>
      {processingTimesSource ? (
        <a
          href={processingTimesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800"
        >
          查询官方处理时间（{processingTimesSource.organization}）↗
          <span className="sr-only">（在新标签页打开）</span>
        </a>
      ) : null}
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        费用、处理时间等易变信息以打开后的官方页面为准 · 最近核验 {lastVerified}
      </p>
    </section>
  );
}
