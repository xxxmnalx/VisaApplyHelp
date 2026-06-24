import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs leading-relaxed text-slate-500">
        <p>
          本站提供流程整理，不代替政府官方网站、法律意见或签证决定。政策可能变化，请以页面标注的官方来源为准。
        </p>
        <p className="mt-2">
          <Link href="/privacy" className="underline hover:text-slate-800">
            隐私说明
          </Link>
        </p>
      </div>
    </footer>
  );
}
