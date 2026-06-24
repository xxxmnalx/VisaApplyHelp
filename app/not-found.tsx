import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-sm font-medium text-blue-700">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">没有找到这个步骤</h1>
      <p className="mt-3 text-slate-600">页面可能已调整，或这条身份流程尚未开放。</p>
      <Link
        href="/start"
        className="mt-8 inline-block rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
      >
        返回身份选择
      </Link>
    </main>
  );
}
