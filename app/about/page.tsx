import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">关于本站</h1>
      <p className="mt-4 text-sm leading-relaxed text-neutral-700">
        本站面向<strong>持中国护照、居住在美国</strong>的用户群体（F1/OPT/H1B/H4/J1/绿卡），
        提供加拿大、日本、韩国等第三国签证的结构化攻略。
      </p>
      <h2 className="mt-6 text-base font-semibold">本站不适用于</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
        <li>在中国大陆境内出境的用户</li>
        <li>美国公民</li>
      </ul>
      <h2 className="mt-6 text-base font-semibold">免责声明</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">
        本站仅供参考，不构成法律意见。签证政策时常变化，请以使领馆官方信息为准。
      </p>
      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/" className="underline">
          ← 返回首页
        </Link>
      </p>
    </main>
  );
}
