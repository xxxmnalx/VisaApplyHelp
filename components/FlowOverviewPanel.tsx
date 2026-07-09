import { VerifiedChip } from "@/components/VerifiedChip";
import type { OfficialSource } from "@/lib/flow-types";

type FlowOverviewPanelProps = {
  officialFee: string;
  /** 无生物信息采集环节的国家不传。 */
  biometricsFee?: string;
  lastVerified: string;
  processingTimesSource?: OfficialSource;
};

/** 费用与时间总览：嵌在当前步卡内的一节（仅第一步渲染）。 */
export function FlowOverviewPanel({
  officialFee,
  biometricsFee,
  lastVerified,
  processingTimesSource,
}: FlowOverviewPanelProps) {
  return (
    <section
      aria-labelledby="overview-panel-title"
      className="border-b border-line-faint p-3.5 sm:p-5"
    >
      <h2 id="overview-panel-title" className="text-[13px] font-semibold text-ink">
        费用与时间总览
      </h2>
      <dl className="mt-2.5 space-y-2.5 text-[12.5px]">
        <div>
          <dt className="text-[11px] font-medium text-ink-mute">官方申请费</dt>
          <dd className="mt-0.5 leading-relaxed text-ink">{officialFee}</dd>
        </div>
        {biometricsFee ? (
          <div>
            <dt className="text-[11px] font-medium text-ink-mute">生物信息费</dt>
            <dd className="mt-0.5 leading-relaxed text-ink">{biometricsFee}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-[11px] font-medium text-ink-mute">本站用户时间线</dt>
          <dd className="mt-0.5 leading-relaxed text-ink-mute">
            数据收集中：样本不足时不展示统计，且始终与官方处理时间分开标注。
          </dd>
        </div>
      </dl>
      {processingTimesSource ? (
        <a
          href={processingTimesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-[44px] items-center text-xs font-medium text-pine underline underline-offset-2 hover:text-pine-deep"
        >
          查询官方处理时间（{processingTimesSource.organization}）↗
          <span className="sr-only">（在新标签页打开）</span>
        </a>
      ) : null}
      <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] leading-relaxed text-ink-mute">
        费用、处理时间等易变信息以打开后的官方页面为准
        <VerifiedChip date={lastVerified} />
      </p>
    </section>
  );
}
