import Link from "next/link";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";

export default function Home() {
  const list = countries as Country[];
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">在美华人第三国签证攻略</h1>
      <p className="mt-2 text-sm text-neutral-600">
        面向持中国护照、居住在美国的用户群体。请选择目的地国家。
      </p>
      <ul className="mt-6 space-y-3">
        {list.map((c) => (
          <li key={c.code}>
            <Link
              href={`/${c.code.toLowerCase()}`}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
            >
              <span className="text-2xl" aria-hidden>
                {c.flag}
              </span>
              <span className="text-base">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/about" className="underline">
          关于本站
        </Link>
      </p>
    </main>
  );
}
