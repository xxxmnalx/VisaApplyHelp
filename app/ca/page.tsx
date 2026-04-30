import Link from "next/link";
import { listGuides } from "@/lib/guides";

export default function CanadaPage() {
  const guides = listGuides("CA");
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">🇨🇦 加拿大签证</h1>
      <p className="mt-2 text-sm text-neutral-600">
        从美国境内申请加拿大签证的攻略。
      </p>
      {guides.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">攻略撰写中，敬请期待。</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/ca/${g.slug}`}
                className="block rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
              >
                <div className="text-base">{g.visaType}</div>
                <div className="mt-1 text-xs text-neutral-500">
                  适用：{g.forStatus.join(" / ")} · 更新于 {g.lastUpdated}
                </div>
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
