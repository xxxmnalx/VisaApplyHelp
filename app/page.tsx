import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { averageEtaLabel } from "@/lib/domain/eta";
import { listFlows } from "@/lib/flows";
import type { FlowConfig } from "@/lib/flow-types";

type CountryCard = {
  countrySlug: string;
  countryFlag: string;
  countryName: string;
  visaType: string;
  stepsCount: number;
  etaLabel: string | null;
  statusLabels: string[];
  lastVerified: string;
};

function collectCountryCards(flows: FlowConfig[]): CountryCard[] {
  const cards = new Map<string, CountryCard>();
  for (const flow of flows) {
    const existing = cards.get(flow.countrySlug);
    if (existing) {
      if (!existing.statusLabels.includes(flow.statusLabel)) {
        existing.statusLabels.push(flow.statusLabel);
      }
      if (flow.lastVerified > existing.lastVerified) {
        existing.lastVerified = flow.lastVerified;
      }
    } else {
      cards.set(flow.countrySlug, {
        countrySlug: flow.countrySlug,
        countryFlag: flow.countryFlag,
        countryName: flow.countryName,
        visaType: flow.visaType,
        stepsCount: flow.steps.length,
        etaLabel: averageEtaLabel(flow.etaStages),
        statusLabels: [flow.statusLabel],
        lastVerified: flow.lastVerified,
      });
    }
  }
  return Array.from(cards.values());
}

const howItWorks: Array<[string, string, string]> = [
  ["1", "确认身份", "选择你当前的美国身份（F-1 / H-1B），只加载匹配的流程配置。"],
  ["2", "选择国家", "在加拿大、日本、韩国之间选择，进流程前就能看到全部节点。"],
  ["3", "一步步完成", "按 Checklist 准备材料，在正确的节点进入官方系统操作。"],
  ["4", "走到拿签", "覆盖审理、递交护照到收到签证核对信息的每个阶段。"],
];

export default function HomePage() {
  const countryCards = collectCountryCards(listFlows());

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-line-soft bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-pine-edge bg-pine-tint px-3 py-1 text-xs font-medium text-pine">
              已覆盖 {countryCards.length} 个国家 · F-1 与 H-1B 身份
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.15]">
              不只是看攻略，
              <br />
              <span className="text-pine">一步一步完成签证申请。</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              面向在美中国护照持有人：先确认你的美国身份，再选择要申请的国家，获得对应的材料
              Checklist、官方入口和全程可见的流程节点。本站不接收申请材料，也不代替政府系统。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/start"
                className="rounded-lg bg-pine px-6 py-3.5 text-center font-semibold text-white no-underline transition hover:bg-pine-deep hover:no-underline"
              >
                确认身份并开始 →
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-line bg-white px-6 py-3.5 text-center font-medium text-ink no-underline transition hover:border-node-box hover:no-underline"
              >
                了解本站怎么运作
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-xl font-semibold text-ink">可申请的国家</h2>
          <p className="mt-1 text-sm text-ink-mute">
            确认身份后即可进入对应流程；费用与要求以官方页面为准。
          </p>
          <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
            {countryCards.map((card) => (
              <article
                key={card.countrySlug}
                className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-card transition hover:border-node-box"
              >
                <span aria-hidden className="text-3xl">
                  {card.countryFlag}
                </span>
                <h3 className="mt-3 font-semibold text-ink">
                  {card.countryName}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{card.visaType}</p>
                <p className="mt-3 text-xs leading-relaxed text-ink-mute">
                  共 <span className="font-mono text-ink">{card.stepsCount}</span>{" "}
                  步{card.etaLabel ? <> · 平均{card.etaLabel}</> : null} · 适用{" "}
                  {card.statusLabels.join(" / ")}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  最近核验{" "}
                  <span className="font-mono">{card.lastVerified}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-line-soft bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="text-xl font-semibold text-ink">怎么用</h2>
            <div className="mt-5 grid gap-3.5 sm:grid-cols-4">
              {howItWorks.map(([number, title, description]) => (
                <article
                  key={number}
                  className="rounded-xl border border-line bg-white p-5 shadow-card"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pine-tint font-mono text-sm font-semibold text-pine">
                    {number}
                  </span>
                  <h3 className="mt-3 font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-8 rounded-xl border border-line bg-paper-bright p-4 text-xs leading-relaxed text-ink-mute">
              隐私底线：进度只保存在你当前的浏览器；不收集护照号、申请号、出生日期或任何申请材料。关键要求均标注官方来源与最近核验日期。
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
