type VerifiedChipProps = {
  /** 最近核验日期（yyyy-mm-dd）。 */
  date: string;
  /** 前缀文案，默认「官方来源」；传 null 只显示「核验于」。 */
  label?: string | null;
};

/** 信任 chip：小而常驻的核验标记，数字与日期一律等宽。 */
export function VerifiedChip({ date, label = "官方来源" }: VerifiedChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-bright px-2.5 py-1 text-[11px] leading-none text-ink-soft">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pine" />
      {label ? `${label} · ` : null}核验于{" "}
      <span className="font-mono text-ink">{date}</span>
    </span>
  );
}
