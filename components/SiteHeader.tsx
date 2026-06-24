import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight text-slate-950">
          签证步骤助手
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4 text-sm">
          <Link href="/start" className="text-blue-700 hover:text-blue-900">
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
