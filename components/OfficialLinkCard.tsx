import type { OfficialSource } from "@/lib/flow-types";

type OfficialLinkCardProps = {
  source: OfficialSource;
};

export function OfficialLinkCard({ source }: OfficialLinkCardProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer noopener"
      className="block rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100"
    >
      <span className="text-sm font-medium text-blue-900">{source.label} ↗</span>
      <span className="mt-1 block text-xs text-blue-700">
        {source.organization} · 核验于 {source.lastVerified}
      </span>
    </a>
  );
}
