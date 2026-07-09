import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-20 text-center">
        <p className="font-mono text-sm font-medium text-pine">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          没有找到这个步骤
        </h1>
        <p className="mt-3 text-ink-soft">
          页面可能已调整，或这条身份流程尚未开放。
        </p>
        <Link
          href="/start"
          className="mt-8 inline-block rounded-lg bg-pine px-5 py-3 font-semibold text-white no-underline transition hover:bg-pine-deep hover:no-underline"
        >
          返回开始页 →
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
