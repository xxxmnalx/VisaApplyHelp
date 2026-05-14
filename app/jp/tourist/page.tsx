import Link from "next/link";
import { notFound } from "next/navigation";
import StatusPicker from "@/components/StatusPicker";
import { getFlow } from "@/lib/flows";
import statuses from "@/data/statuses.json";
import type { Status } from "@/lib/types";

export default function JpTouristPage() {
  const flow = getFlow("jp-tourist");
  if (!flow) notFound();
  const list = statuses as Status[];

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">{flow.name}</h1>
      <p className="mt-2 text-sm text-neutral-600">{flow.summary}</p>

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-neutral-500">官费</dt>
        <dd>{flow.officialFee}</dd>
        <dt className="text-neutral-500">大致工作日</dt>
        <dd>{flow.processingDays}</dd>
        <dt className="text-neutral-500">最近更新</dt>
        <dd>{flow.lastUpdated}</dd>
      </dl>

      <div className="mt-8">
        <StatusPicker
          statuses={list}
          supportedStatus={flow.supportedStatus}
          hrefFor={(s) => `/jp/tourist/wizard?status=${s}`}
        />
      </div>

      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/jp" className="underline">
          ← 返回日本列表
        </Link>
      </p>
    </main>
  );
}
