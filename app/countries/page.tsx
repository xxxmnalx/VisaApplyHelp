import type { Metadata } from "next";
import { CountrySelector } from "@/components/CountrySelector";

export const metadata: Metadata = {
  title: "选择申请国家",
  description:
    "根据已确认的美国身份，选择要申请的国家：加拿大、日本或韩国，并预览完整流程节点。",
};

export default function CountriesPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-sm font-medium text-blue-700">第 2 步 · 选择国家</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        你想申请哪个国家？
      </h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        每张卡片都列出了该国流程的全部节点，进入后每一步都能看到自己走到哪里。
      </p>
      <div className="mt-8">
        <CountrySelector />
      </div>
    </main>
  );
}
