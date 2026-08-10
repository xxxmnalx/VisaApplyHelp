import Link from "next/link";
import { visaapplyPath } from "@/lib/routes";

/** 站点页脚（首页与说明页使用；入口页与流程页自带隐私 + 清除页脚）。 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line-soft bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs leading-relaxed text-ink-mute sm:px-6">
        <p>
          本站提供流程整理，不代替政府官方网站、法律意见或签证决定。政策可能变化，请以页面标注的官方来源为准。
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href={visaapplyPath("/privacy")}
            className="underline hover:text-ink"
          >
            隐私说明
          </Link>
          <Link
            href={visaapplyPath("/about")}
            className="underline hover:text-ink"
          >
            关于本站
          </Link>
          <Link
            href={visaapplyPath("/start")}
            className="underline hover:text-ink"
          >
            开始申请
          </Link>
          <Link href="/" className="underline hover:text-ink">
            个人主页
          </Link>
        </div>
      </div>
    </footer>
  );
}
