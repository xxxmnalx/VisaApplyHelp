import Link from "next/link";
import { notFound } from "next/navigation";
import WizardShell from "@/components/WizardShell";
import { getFlow } from "@/lib/flows";
import type { UsStatus } from "@/lib/types";

type SearchParams = { status?: string };

export default function JpTouristWizardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const flow = getFlow("jp-tourist");
  if (!flow) notFound();

  const status = searchParams.status as UsStatus | undefined;
  if (!status || !flow.supportedStatus.includes(status)) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-semibold">请先选择身份</h1>
        <p className="mt-3 text-sm text-neutral-600">
          这个向导需要先指定你在美的身份，才能展示对应的材料和步骤。
        </p>
        <p className="mt-6 text-sm">
          <Link href="/jp/tourist" className="underline">
            ← 回到身份选择
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 pb-12 pt-6">
      <div className="text-xs text-neutral-500">
        <Link href="/jp/tourist" className="underline">
          {flow.name}
        </Link>
        <span className="mx-1">·</span>
        <span>身份：{status}</span>
      </div>
      <div className="mt-4">
        <WizardShell flow={flow} status={status} />
      </div>
    </main>
  );
}
