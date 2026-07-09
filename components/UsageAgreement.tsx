"use client";

import { useState } from "react";

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

export function UsageAgreement({ onAgree }: UsageAgreementProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="agreement-title"
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      >
        <h2 id="agreement-title" className="text-base font-semibold text-slate-950">
          使用须知
        </h2>
        <dl className="mt-3 space-y-3">
          {points.map((point) => (
            <div key={point.title}>
              <dt className="text-sm font-medium text-slate-900">
                {point.title}
              </dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-slate-600">
                {point.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>我已阅读并理解以上说明，并同意继续。</span>
      </label>

      <button
        type="button"
        disabled={!agreed}
        onClick={onAgree}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        我同意，继续
      </button>
    </div>
  );
}
