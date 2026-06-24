import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私说明",
  description: "了解签证步骤助手如何在本地保存流程进度。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">隐私说明</h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
        <section>
          <h2 className="font-semibold text-slate-950">0.1 版本保存什么</h2>
          <p className="mt-2">
            当前身份选择、Checklist 状态、所在步骤，以及用户主动填写的流程日期。这些内容仅保存在当前浏览器的
            localStorage 中。
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-950">我们不保存什么</h2>
          <p className="mt-2">
            本站不要求输入或上传姓名、护照号码、UCI、申请号、出生日期、学校名称、银行资料、申请表答案或证明文件。
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-950">如何删除</h2>
          <p className="mt-2">
            用户可以在流程页底部清除进度。清除浏览器网站数据也会删除本地记录，且目前无法跨设备恢复。
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-950">未来时间线调研</h2>
          <p className="mt-2">
            0.1 不会把时间线上传到服务器。未来如开放匿名统计，会在收集前单独说明字段、用途、保存方式和退出机制。
          </p>
        </section>
      </div>
    </main>
  );
}
