"use client";

import { useState } from "react";
import { IDENTITY_GATE_CONDITIONS } from "@/config/identities";

type UsageAgreementProps = {
  onAgree: () => void;
};

const points: Array<{ title: string; body: string }> = [
  {
    title: "这是什么",
    body: "本站把官方签证信息整理成可执行的步骤助手，不是官方申请系统，也不替你提交申请。",
  },
  {
    title: "不构成意见、不保证结果",
    body: "内容不构成法律或移民意见；不保证获批，也不保证在任何时间内拿到签证。页面上的 ETA 与样本统计都是估算，不代表官方审理进度。",
  },
  {
    title: "官方优先",
    body: "关键要求、费用、入口和处理时间以打开后的官方页面为准；第三方经验仅供理解操作，不覆盖官方规则。",
  },
  {
    title: "隐私",
    body: "只在你当前浏览器保存非敏感进度，不收集姓名、护照号、UCI、SEVIS ID、A-Number、申请号、出生日期或账户密码。",
  },
  {
    title: "你来操作官方系统",
    body: "填表、缴费、预约、递交护照都在政府或 VFS 官方系统完成；本站不代填、不代交、不读取你的账户。",
  },
  {
    title: "签证不等于入境",
    body: "即使获签，最终是否入境由目的国边境官员在口岸决定。",
  },
];

/** 使用须知必读门：一次阅读、一次勾选（含硬性适用条件），之后信任信号转为小而常驻。 */
export function UsageAgreement({ onAgree }: UsageAgreementProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      <section
        aria-labelledby="agreement-title"
        className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5"
      >
        <h2 id="agreement-title" className="text-[15px] font-semibold text-ink">
          使用须知
        </h2>
        <dl className="mt-3 space-y-3">
          {points.map((point) => (
            <div key={point.title}>
              <dt className="text-[13px] font-medium text-ink">{point.title}</dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                {point.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="conditions-title"
        className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5"
      >
        <h2 id="conditions-title" className="text-[15px] font-semibold text-ink">
          适用条件
        </h2>
        <ul className="mt-3 space-y-2">
          {IDENTITY_GATE_CONDITIONS.map((condition) => (
            <li
              key={condition.id}
              className="flex items-start gap-2 text-[13px] text-ink"
            >
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-pine" />
              <span>{condition.label}</span>
            </li>
          ))}
        </ul>
        <details className="mt-3 border-t border-line-faint pt-3">
          <summary className="cursor-pointer text-xs font-medium text-pine hover:text-pine-deep">
            有条件不符合？
          </summary>
          <ul className="mt-2 space-y-2.5">
            {IDENTITY_GATE_CONDITIONS.map((condition) => (
              <li key={condition.id} className="text-xs leading-relaxed">
                <p className="font-medium text-ink">{condition.label}</p>
                <p className="mt-0.5 text-ink-soft">{condition.unsupportedHint}</p>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <label className="flex cursor-pointer items-start gap-3 px-0.5 text-[13px] leading-relaxed text-ink">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-node-box text-pine focus:ring-pine"
        />
        <span>我已阅读并理解以上说明，确认符合适用条件，并同意继续。</span>
      </label>

      <button
        type="button"
        disabled={!agreed}
        onClick={onAgree}
        className="w-full rounded-lg bg-pine px-4 py-3 text-[14.5px] font-semibold text-white transition hover:bg-pine-deep disabled:cursor-not-allowed disabled:bg-node-track disabled:text-ink-mute"
      >
        我同意，开始使用
      </button>
    </div>
  );
}
