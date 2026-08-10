import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { visaapplyPath } from "@/lib/routes";

/** 站点页头（首页与说明页使用；入口页与流程页自带页面级页头）。 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line-soft bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href={visaapplyPath()}
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-ink no-underline hover:no-underline"
        >
          <BrandMark size={20} />
          签证步骤助手
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4 text-sm">
          <Link
            href={visaapplyPath("/start")}
            className="font-semibold text-pine no-underline hover:text-pine-deep hover:no-underline"
          >
            开始申请 →
          </Link>
          <Link
            href={visaapplyPath("/about")}
            className="text-ink-soft no-underline hover:text-ink hover:no-underline"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
