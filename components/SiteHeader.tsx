import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-slate-950"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-sm text-white"
          >
            ✈
          </span>
          签证步骤助手
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4 text-sm">
          <Link
            href="/start"
            className="rounded-lg bg-blue-700 px-3 py-1.5 font-medium text-white transition hover:bg-blue-800"
          >
            开始申请
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-slate-950">
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
