"use client";

import { useEffect, useState } from "react";
import { VerifiedChip } from "@/components/VerifiedChip";
import { fetchUsdRate, type UsdRate } from "@/lib/exchange-rate";
import type { FeeItem, OfficialSource } from "@/lib/flow-types";

type FlowOverviewPanelProps = {
  officialFee: string;
  /** 无生物信息采集环节的国家不传。 */
  biometricsFee?: string;
  /** 有结构化分项时渲染分项 + 总计 + 美元参考换算，否则退回文字口径。 */
  feeItems?: FeeItem[];
  lastVerified: string;
  processingTimesSource?: OfficialSource;
};

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US");
}

/** 费用与时间总览：嵌在当前步卡内的一节（仅第一步渲染）。 */
export function FlowOverviewPanel({
  officialFee,
  biometricsFee,
  feeItems,
  lastVerified,
  processingTimesSource,
}: FlowOverviewPanelProps) {
  const hasBreakdown = Boolean(feeItems && feeItems.length > 0);
  // 当前配置内单流程只有一种货币；USD 自身不需要换算。
  const currency = hasBreakdown ? feeItems![0].currency : null;
  const needsConversion = Boolean(currency && currency !== "USD");
  const [usdRate, setUsdRate] = useState<UsdRate | null>(null);

  useEffect(() => {
    if (!currency || currency === "USD") return;
    let isActive = true;
    void fetchUsdRate(currency).then((rate) => {
      if (isActive) setUsdRate(rate);
    });
    return () => {
      isActive = false;
    };
  }, [currency]);

  const totalAmount = hasBreakdown
    ? feeItems!.reduce((sum, item) => sum + item.amount, 0)
    : 0;
  const totalApproximate = hasBreakdown
    ? feeItems!.some((item) => item.approximate)
    : false;
  const usdTotal =
    needsConversion && usdRate ? Math.round(totalAmount * usdRate.rate) : null;

  return (
    <section
      aria-labelledby="overview-panel-title"
      className="border-b border-line-faint p-3.5 sm:p-5"
    >
      <h2 id="overview-panel-title" className="text-[13px] font-semibold text-ink">
        费用与时间总览
      </h2>

      {hasBreakdown ? (
        <div className="mt-2.5 overflow-hidden rounded-lg border border-line-faint">
          {feeItems!.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 border-b border-line-faint px-3 py-2"
            >
              <span className="min-w-0 text-xs text-ink-soft">
                {item.label}
                {item.note ? (
                  <span className="mt-0.5 block text-[10.5px] leading-relaxed text-ink-faint">
                    {item.note}
                  </span>
                ) : null}
              </span>
              <span className="whitespace-nowrap font-mono text-xs text-ink">
                {item.approximate ? "约 " : ""}
                {item.currency} {formatAmount(item.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-start justify-between gap-3 bg-paper-bright px-3 py-2">
            <span className="flex-none whitespace-nowrap text-xs font-semibold text-ink">
              总计
            </span>
            <span className="text-right">
              <span className="whitespace-nowrap font-mono text-xs font-semibold text-ink">
                {totalApproximate ? "约 " : ""}
                {currency} {formatAmount(totalAmount)}
              </span>
              {usdTotal !== null && usdRate ? (
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-ink-mute">
                  按当前汇率约合{" "}
                  <span className="font-mono text-ink">USD {formatAmount(usdTotal)}</span>
                  （1 {currency} ≈{" "}
                  <span className="font-mono">{usdRate.rate.toFixed(4)}</span> USD，
                  欧洲央行参考价 <span className="font-mono">{usdRate.date}</span>）
                </span>
              ) : null}
            </span>
          </div>
        </div>
      ) : (
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
        </dl>
      )}

      <p className="mt-2.5 text-[11px] leading-relaxed text-ink-mute">
        本站用户时间线：数据收集中，样本不足时不展示统计，且始终与官方处理时间分开标注。
      </p>

      {processingTimesSource ? (
        <a
          href={processingTimesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[44px] items-center text-xs font-medium text-pine underline underline-offset-2 hover:text-pine-deep"
        >
          查询官方处理时间（{processingTimesSource.organization}）↗
          <span className="sr-only">（在新标签页打开）</span>
        </a>
      ) : null}
      <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] leading-relaxed text-ink-mute">
        费用与汇率为参考，实际扣款金额以官方支付页面为准
        <VerifiedChip date={lastVerified} />
      </p>
    </section>
  );
}
