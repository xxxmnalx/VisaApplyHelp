import Link from "next/link";
import { listFlows } from "@/lib/flows";
import type { FlowConfig } from "@/lib/flow-types";

type CountryCard = {
  countrySlug: string;
  countryFlag: string;
  countryName: string;
  visaType: string;
  stepsCount: number;
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
    <main>
      <section className="border-b border-slate-200/70 bg-gradient-to-b from-blue-50/80 via-white to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
            已覆盖 {countryCards.length} 个国家 · F-1 与 H-1B 身份
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.15]">
            不只是看攻略，
            <br />
            <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
              一步一步完成签证申请。
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            面向在美中国护照持有人：先确认你的美国身份，再选择要申请的国家，获得对应的材料
            Checklist、官方入口和全程可见的流程节点。本站不接收申请材料，也不代替政府系统。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/start"
              className="rounded-xl bg-blue-700 px-6 py-3.5 text-center font-medium text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-lg"
            >
              确认身份并开始 →
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-medium text-slate-800 transition hover:bg-slate-50"
            >
              了解本站怎么运作
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold text-slate-950">可申请的国家</h2>
        <p className="mt-1 text-sm text-slate-500">
          确认身份后即可进入对应流程；费用与要求以官方页面为准。
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {countryCards.map((card) => (
            <article
              key={card.countrySlug}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span aria-hidden className="text-3xl">
                {card.countryFlag}
              </span>
              <h3 className="mt-3 font-semibold text-slate-950">
                {card.countryName}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{card.visaType}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {card.stepsCount} 个步骤 · 适用 {card.statusLabels.join(" / ")}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                最近核验 {card.lastVerified}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold text-slate-950">怎么用</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {howItWorks.map(([number, title, description]) => (
              <article
                key={number}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {number}
                </span>
                <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            隐私底线：进度只保存在你当前的浏览器；不收集护照号、申请号、出生日期或任何申请材料。关键要求均标注官方来源与最近核验日期。
          </p>
        </div>
      </section>
    </main>
  );
}
