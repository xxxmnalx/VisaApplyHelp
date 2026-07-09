import type { EligibilityCondition, UsIdentityOption } from "@/lib/flow-types";

/** 当前已开放流程配置的身份代码。 */
export type SupportedIdentityCode = "F1" | "H1B";

/**
 * 身份确认页的身份选项。先确认身份，再选择申请国家；
 * 身份差异由各国流程的独立配置表达，不在页面组件内堆叠判断。
 */
export const US_IDENTITY_OPTIONS: UsIdentityOption[] = [
  {
    code: "F1",
    slug: "f1",
    label: "F-1 在读学生",
    shortLabel: "F-1",
    note: "在美就读、持有效 I-20",
    supported: true,
  },
  {
    code: "H1B",
    slug: "h1b",
    label: "H-1B 工作身份",
    shortLabel: "H-1B",
    note: "在美工作、持 I-797 批准通知",
    supported: true,
  },
  {
    code: "OPT",
    slug: "opt",
    label: "OPT / STEM OPT",
    shortLabel: "OPT",
    note: "下一批开放",
    supported: false,
  },
  {
    code: "J1",
    slug: "j1",
    label: "J-1 交流访问",
    shortLabel: "J-1",
    note: "后续版本",
    supported: false,
  },
  {
    code: "L1",
    slug: "l1",
    label: "L-1 跨国调动",
    shortLabel: "L-1",
    note: "后续版本",
    supported: false,
  },
  {
    code: "DEPENDENT",
    slug: "dependent",
    label: "F-2 / H-4 / J-2 家属",
    shortLabel: "家属",
    note: "后续版本",
    supported: false,
  },
];

/**
 * 使用本站流程的硬性适用条件（决定加载哪套配置，与「常识类自查」不同）。
 * 常识类条件（旅行计划、无犯罪记录等）已合并为各流程第一步的单个勾选框。
 */
export const IDENTITY_GATE_CONDITIONS: EligibilityCondition[] = [
  {
    id: "chinese-passport",
    label: "我持中国普通护照",
    unsupportedHint:
      "其他国籍需要的入境文件不同（可能免签或走电子许可），请以目的国官方判断工具确认。",
  },
  {
    id: "in-us",
    label: "我目前人在美国",
    unsupportedHint:
      "本站流程面向在美国境内申请；在其他国家请以当地使领馆或签证中心为准。",
  },
  {
    id: "adult",
    label: "我已年满 18 岁",
    unsupportedHint: "未成年人通常需要额外的监护与同意文件，当前版本暂未覆盖。",
  },
];

export function getIdentityOption(code: string): UsIdentityOption | null {
  return US_IDENTITY_OPTIONS.find((option) => option.code === code) ?? null;
}
