import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于本站",
  description: "了解签证步骤助手的服务范围、隐私原则和免责声明。",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">关于本站</h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
        <p>
          本站面向持中国护照、居住在美国的非移民身份用户，提供第三国签证的逐步申请流程。0.1
          版本聚焦 F-1 在读学生申请加拿大访客签证。
        </p>
        <section>
          <h2 className="font-semibold text-slate-950">我们会做什么</h2>
          <p className="mt-2">
            帮助你确认流程、准备 Checklist、进入正确的官方网站，并记录不含敏感信息的本地进度。
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-950">我们不会做什么</h2>
          <p className="mt-2">
            本站不代填或代交申请，不上传用户材料，不存储护照号、UCI、申请号或银行资料，也不提供法律意见或批准保证。
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-950">信息时效</h2>
          <p className="mt-2">
            签证政策、费用和签证申请中心要求可能变化。页面会标注官方来源与最近核验日期，实际操作必须以官方页面和用户收到的通知为准。
          </p>
        </section>
      </div>
      <Link
        href="/start"
        className="mt-8 inline-block rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
      >
        开始确认身份
      </Link>
    </main>
  );
}
