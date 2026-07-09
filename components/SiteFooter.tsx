import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs leading-relaxed text-slate-500">
        <p>
          本站提供流程整理，不代替政府官方网站、法律意见或签证决定。政策可能变化，请以页面标注的官方来源为准。
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/privacy" className="underline hover:text-slate-800">
            隐私说明
          </Link>
          <Link href="/about" className="underline hover:text-slate-800">
            关于本站
          </Link>
          <Link href="/countries" className="underline hover:text-slate-800">
            选择国家
          </Link>
        </div>
      </div>
    </footer>
  );
}
