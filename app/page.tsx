import Link from "next/link";
import { listFlows } from "@/lib/flows";
import { visaapplyPath } from "@/lib/routes";

const GITHUB_URL = "https://github.com/xxxmnalx";

/** 域名根路径的个人主页：简介 + 项目入口；签证助手挂在 /project/visaapply。 */
export default function HomePage() {
  const flows = listFlows();
  const countryCount = new Set(flows.map((flow) => flow.countrySlug)).size;
  const statusLabels = Array.from(
    new Set(flows.map((flow) => flow.statusLabel)),
  );
  const latestVerified = flows
    .map((flow) => flow.lastVerified)
    .sort()
    .at(-1);

  return (
    <>
      <header className="border-b border-line-soft bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-ink no-underline hover:no-underline"
          >
            Leyang Cheng
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-soft no-underline hover:text-ink hover:no-underline"
          >
            GitHub ↗
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6">
        <section className="py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            你好，我是 Leyang Cheng。
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            这里是我的个人主页，收录我正在做的项目。
          </p>
        </section>

        <section className="border-t border-line-soft py-10 sm:py-12">
          <h2 className="text-xl font-semibold text-ink">项目</h2>
          <div className="mt-5 grid gap-3.5">
            <Link
              href={visaapplyPath()}
              className="block rounded-xl border border-line bg-white p-5 no-underline shadow-card transition hover:border-node-box hover:no-underline"
            >
              <h3 className="font-semibold text-ink">
                在美华人第三国签证步骤助手
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                面向在美中国护照持有人：确认美国身份后，按 Checklist
                和官方入口一步步完成第三国签证申请。免费、不收集申请材料。
              </p>
              <p className="mt-3 text-xs text-ink-mute">
                覆盖 {countryCount} 个国家 · 适用 {statusLabels.join(" / ")}
                {latestVerified ? (
                  <>
                    {" "}
                    · 最近核验 <span className="font-mono">{latestVerified}</span>
                  </>
                ) : null}
              </p>
              <p className="mt-3 text-sm font-semibold text-pine">
                进入项目 →
              </p>
            </Link>
          </div>
        </section>
      </main>
      <footer className="mt-auto border-t border-line-soft bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-8 text-xs text-ink-mute sm:px-6">
          <span>© {new Date().getFullYear()} Leyang Cheng</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
