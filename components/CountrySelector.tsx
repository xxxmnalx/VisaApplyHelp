"use client";

import Link from "next/link";
import { VerifiedChip } from "@/components/VerifiedChip";
import { averageEtaLabel } from "@/lib/domain/eta";
import type { FlowConfig } from "@/lib/flow-types";
import { getStepPath } from "@/lib/flows";

/** 某条流程的断点信息（存在真实进度时）。 */
export type CountryResume = {
  stepSlug: string;
  stepNumber: number;
  stepTitle: string;
};

type CountrySelectorProps = {
  flows: FlowConfig[];
  resumeByFlowId: Record<string, CountryResume>;
};

/**
 * 国家卡：进流程前就写明「共 N 步 · 平均约多久」，降低起步门槛；
 * 有进度的卡带常驻续接条（上次进行到第几步 + 「继续 →」实心按钮）。
 */
export function CountrySelector({
  flows,
  resumeByFlowId,
}: CountrySelectorProps) {
  return (
    <div className="mt-2.5 space-y-2.5">
      {flows.map((flow) => {
        const resume = resumeByFlowId[flow.id];
        const etaLabel = averageEtaLabel(flow.etaStages);
        const targetPath = getStepPath(
          flow,
          resume?.stepSlug ?? flow.steps[0].slug,
        );
        const meta = (
          <>
            共 <span className="font-mono">{flow.steps.length}</span> 步
            {etaLabel ? <> · 平均{etaLabel}</> : null}
          </>
        );

        if (!resume) {
          return (
            <Link
              key={flow.id}
              href={targetPath}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3.5 no-underline transition hover:border-node-box hover:no-underline"
            >
              <span aria-hidden className="text-2xl leading-none">
                {flow.countryFlag}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">
                  {flow.countryName}{" "}
                  <span className="font-normal text-ink-soft">
                    · {flow.visaType}
                  </span>
                </span>
                <span className="mt-px block text-xs text-ink-soft">
                  {meta} · 核验于{" "}
                  <span className="font-mono">{flow.lastVerified}</span>
                </span>
              </span>
              <span aria-hidden className="text-base text-ink-faint">
                ›
              </span>
            </Link>
          );
        }

        return (
          <article
            key={flow.id}
            className="overflow-hidden rounded-xl border border-line bg-white"
          >
            <Link
              href={targetPath}
              className="block p-3.5 pb-3 no-underline transition hover:bg-[#FAFAF6] hover:no-underline"
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden className="text-2xl leading-none">
                  {flow.countryFlag}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">
                    {flow.countryName}{" "}
                    <span className="font-normal text-ink-soft">
                      · {flow.visaType}
                    </span>
                  </span>
                  <span className="mt-px block text-xs text-ink-soft">
                    {meta}
                  </span>
                </span>
              </span>
              <span className="mt-2.5 block">
                <VerifiedChip date={flow.lastVerified} />
              </span>
            </Link>
            <div className="flex items-center gap-2.5 border-t border-pine-edge bg-pine-tint px-3.5 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-pine">
                  上次进行到 第{" "}
                  <span className="font-mono">{resume.stepNumber}</span> 步
                </p>
                <p className="mt-px truncate text-[12.5px] text-ink">
                  {resume.stepTitle}
                </p>
              </div>
              <Link
                href={targetPath}
                className="flex-none rounded-lg bg-pine px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline transition hover:bg-pine-deep hover:no-underline"
              >
                继续 →
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
