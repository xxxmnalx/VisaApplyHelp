import type { Metadata } from "next";
import { StartFlow } from "@/components/StartFlow";

export const metadata: Metadata = {
  title: "开始前",
  description:
    "阅读使用须知并确认当前美国身份，然后选择要申请的国家，加载适用的第三国签证申请流程。",
};

export default function StartPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-sm font-medium text-blue-700">第 1 步 · 约 1 分钟</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        先确认身份，再选择国家
      </h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        申请材料和步骤会随美国身份变化。确认身份后，你可以在加拿大、日本、韩国之间选择要申请的国家。
      </p>
      <div className="mt-8">
        <StartFlow />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        本页只在你的浏览器中记录所选身份与同意时间，不要求输入护照号码、生日、学校或申请号。
      </p>
    </main>
  );
}
