import type { Metadata } from "next";
import { IdentitySelector } from "@/components/IdentitySelector";
import { getDefaultFlow } from "@/lib/flows";

export const metadata: Metadata = {
  title: "确认身份",
  description: "确认当前美国身份，加载适用的第三国签证申请流程。",
};

export default function StartPage() {
  const flow = getDefaultFlow();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-sm font-medium text-blue-700">开始前约 1 分钟</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        先确认你的身份
      </h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        申请材料和步骤会随美国身份变化。0.1 版本只开放 F-1 在读学生，但底层已经为其他身份保留配置入口。
      </p>
      <div className="mt-8">
        <IdentitySelector flow={flow} />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        本页只在你的浏览器中记录所选身份，不要求输入护照号码、生日、学校或申请号。
      </p>
    </main>
  );
}
