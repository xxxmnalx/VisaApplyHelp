import Link from "next/link";
import { listFlowsByCountry } from "@/lib/flows";

export default function CanadaPage() {
  const flows = listFlowsByCountry("CA");
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">🇨🇦 加拿大签证</h1>
      <p className="mt-2 text-sm text-neutral-600">
        从美国境内申请加拿大签证的引导流程。选择一个签证类型开始。
      </p>
      {flows.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">流程撰写中，敬请期待。</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {flows.map((f) => (
            <li key={f.id}>
              <Link
                href={`/ca/${f.id.replace(/^ca-/, "")}`}
                className="block rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
              >
                <div className="text-base font-medium">{f.name}</div>
                <div className="mt-1 text-xs text-neutral-500">
                  适配身份：{f.supportedStatus.join(" / ")} · 更新于 {f.lastUpdated}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{f.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/" className="underline">
          ← 返回首页
        </Link>
      </p>
    </main>
  );
}
