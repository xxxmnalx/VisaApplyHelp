import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "关于本站",
  description: "了解签证步骤助手的服务范围、隐私原则和免责声明。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          关于本站
        </h1>
        <div className="mt-6 space-y-6 text-sm leading-7 text-ink-soft">
          <p>
            本站面向持中国护照、居住在美国的非移民身份用户，提供第三国签证的逐步申请流程。当前支持
            F-1 在读学生与 H-1B 工作身份申请加拿大、日本、韩国的短期签证。
          </p>
          <section>
            <h2 className="font-semibold text-ink">我们会做什么</h2>
            <p className="mt-2">
              帮助你确认流程、准备 Checklist、进入正确的官方网站，并记录不含敏感信息的本地进度。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-ink">我们不会做什么</h2>
            <p className="mt-2">
              本站不代填或代交申请，不上传用户材料，不存储护照号、UCI、申请号或银行资料，也不提供法律意见或批准保证。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-ink">信息时效</h2>
            <p className="mt-2">
              签证政策、费用和签证申请中心要求可能变化。页面会标注官方来源与最近核验日期，实际操作必须以官方页面和用户收到的通知为准。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-ink">第三方经验的来源</h2>
            <p className="mt-2">
              流程中标注「第三方经验」的内容，主要来自华人社区多年持续更新、相互验证的公开分享；本站用自己的话重写并明确定性，它们是宝贵的操作参考，但不代表官方规则。主要参考来源：
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <a
                  href="https://piao.tips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-pine underline underline-offset-2 hover:text-pine-deep"
                >
                  北美票帝 piao.tips ↗
                </a>
                <span className="text-ink-mute">
                  {" "}
                  — 系统化整理的在美办签指南与实时反馈
                </span>
              </li>
              <li>
                <a
                  href="https://www.1point3acres.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-pine underline underline-offset-2 hover:text-pine-deep"
                >
                  一亩三分地 1point3acres.com ↗
                </a>
                <span className="text-ink-mute">
                  {" "}
                  — 华人社区论坛，大量真实申请数据点（DP）
                </span>
              </li>
            </ul>
          </section>
        </div>
        <Link
          href="/start"
          className="mt-8 inline-block rounded-lg bg-pine px-5 py-3 font-semibold text-white no-underline transition hover:bg-pine-deep hover:no-underline"
        >
          开始确认身份 →
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
