type DeadlineChipProps = {
  /** 期限短文案，如「限 30 天」。陈述期限，不倒数、不闪烁。 */
  label: string;
};

/** 死线 chip：琥珀只给「有期限的事实」，可追踪、不制造焦虑。 */
export function DeadlineChip({ label }: DeadlineChipProps) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-deadline-edge bg-deadline-fill px-2 py-px font-mono text-[10px] leading-4 text-deadline-ink">
      {label}
    </span>
  );
}
