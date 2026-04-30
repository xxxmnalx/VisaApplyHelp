import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { getGuideSource, listGuides } from "@/lib/guides";
import type { GuideFrontmatter } from "@/lib/types";

export function generateStaticParams() {
  return listGuides("JP").map((g) => ({ slug: g.slug }));
}

export default function JpGuidePage({ params }: { params: { slug: string } }) {
  const raw = getGuideSource("JP", params.slug);
  if (!raw) notFound();
  const { data } = matter(raw);
  const fm = data as GuideFrontmatter;
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">{fm.visaType}</h1>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-neutral-500">适用身份</dt>
        <dd>{fm.forStatus.join(" / ")}</dd>
        <dt className="text-neutral-500">官费</dt>
        <dd>{fm.officialFee}</dd>
        <dt className="text-neutral-500">大致工作日</dt>
        <dd>{fm.processingDays}</dd>
        <dt className="text-neutral-500">最近更新</dt>
        <dd>{fm.lastUpdated}</dd>
      </dl>
      <p className="mt-6 text-sm text-neutral-500">
        正文渲染待接入（首篇攻略落地时一起写）。
      </p>
      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/jp" className="underline">
          ← 返回日本列表
        </Link>
      </p>
    </main>
  );
}
