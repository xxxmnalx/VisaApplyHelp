import Link from "next/link";
import type { Status, UsStatus } from "@/lib/types";

type StatusPickerProps = {
  statuses: Status[];
  supportedStatus: UsStatus[];
  hrefFor: (status: UsStatus) => string;
};

export default function StatusPicker({ statuses, supportedStatus, hrefFor }: StatusPickerProps) {
  const supported = statuses.filter((s) => supportedStatus.includes(s.code));
  const unsupported = statuses.filter((s) => !supportedStatus.includes(s.code));

  return (
    <div>
      <p className="text-sm text-neutral-600">请选择你当前在美国的身份。</p>
      <ul className="mt-4 space-y-3">
        {supported.map((s) => (
          <li key={s.code}>
            <Link
              href={hrefFor(s.code)}
              className="block rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
            >
              <div className="text-base font-medium">{s.name}</div>
              <div className="mt-1 text-xs text-neutral-500">{s.note}</div>
            </Link>
          </li>
        ))}
      </ul>
      {unsupported.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-neutral-500">本流程暂不适配的身份：</p>
          <ul className="mt-2 space-y-1">
            {unsupported.map((s) => (
              <li key={s.code} className="text-xs text-neutral-400">
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
