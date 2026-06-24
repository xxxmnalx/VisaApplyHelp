import Link from "next/link";
import { getDefaultFlow } from "@/lib/flows";

export default function HomePage() {
  const flow = getDefaultFlow();

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium text-blue-700">0.1 版本现已开放</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            不只是看攻略，
            <br />
            一步一步完成签证申请。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            先确认你的美国身份，再获得对应的材料 Checklist、官方入口和完整流程。本站不接收申请材料，也不代替政府系统。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/start"
              className="rounded-xl bg-blue-700 px-5 py-3 text-center font-medium text-white hover:bg-blue-800"
            >
              确认身份并开始
            </Link>
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-medium text-slate-800 hover:bg-slate-50"
            >
              查看加拿大官方页面 ↗
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm text-slate-500">当前可用流程</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                🇨🇦 F-1 学生申请加拿大访客签证
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                从确认身份、准备材料、在线提交和采集生物信息，一直到递交护照、收到签证并核对信息。
              </p>
            </div>
            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              {flow.steps.length} 个步骤
            </span>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">适用身份</dt>
              <dd className="mt-1 font-medium text-slate-900">{flow.statusLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-500">申请费</dt>
              <dd className="mt-1 font-medium text-slate-900">{flow.officialFee}</dd>
            </div>
            <div>
              <dt className="text-slate-500">最近核验</dt>
              <dd className="mt-1 font-medium text-slate-900">{flow.lastVerified}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["1", "确认身份", "只加载与你当前美国身份匹配的配置。"],
            ["2", "完成 Checklist", "按步骤准备信息和材料，并进入官方系统操作。"],
            ["3", "走到收到签证", "覆盖指纹、审理、护照递交和最终核对。"],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="text-sm font-semibold text-blue-700">{number}</span>
              <h2 className="mt-2 font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
