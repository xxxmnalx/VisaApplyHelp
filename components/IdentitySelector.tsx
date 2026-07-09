"use client";

import { US_IDENTITY_OPTIONS } from "@/config/identities";

type IdentitySelectorProps = {
  selectedCode: string | null;
  /** 点选即保存；持久化与回读校验由父级（StartFlow）负责。 */
  onSelect: (code: string) => void;
};

/**
 * 身份卡：已开放身份并排成卡，点选即生效（选中 = 杉绿描边 + 勾章）；
 * 未开放身份收敛为一行灰字，不做死胡同页面。
 */
export function IdentitySelector({
  selectedCode,
  onSelect,
}: IdentitySelectorProps) {
  const supported = US_IDENTITY_OPTIONS.filter((option) => option.supported);
  const unsupported = US_IDENTITY_OPTIONS.filter((option) => !option.supported);

  return (
    <div>
      <div role="radiogroup" aria-label="你当前的美国身份" className="flex gap-2.5">
        {supported.map((option) => {
          const isSelected = selectedCode === option.code;
          // 卡片副标题：从完整标签中去掉身份代码（如「F-1 在读学生」→「在读学生」）。
          const subtitle = option.label.replace(option.shortLabel, "").trim();
          return (
            <button
              key={option.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.code)}
              className={`relative flex-1 rounded-xl border bg-white p-3.5 text-left transition ${
                isSelected
                  ? "border-pine ring-1 ring-pine"
                  : "border-line hover:border-node-box"
              }`}
            >
              {isSelected ? (
                <span
                  aria-hidden
                  className="absolute right-2.5 top-2.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-pine text-[11px] text-white"
                >
                  ✓
                </span>
              ) : null}
              <span
                className={`block font-mono text-base font-bold ${
                  isSelected ? "text-pine" : "text-ink"
                }`}
              >
                {option.shortLabel}
              </span>
              <span className="mt-0.5 block text-xs text-ink-soft">
                {subtitle}
              </span>
            </button>
          );
        })}
      </div>
      {unsupported.length > 0 ? (
        <p className="mt-2 px-0.5 text-[11.5px] text-ink-faint">
          {unsupported.map((option) => option.shortLabel).join(" / ")} 等其他身份
          · 未开放
        </p>
      ) : null}
    </div>
  );
}
