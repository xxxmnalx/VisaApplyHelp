import type { EtaStage } from "@/lib/flow-types";

export type EtaEstimate = {
  submitDate: string;
  totalMinDays: number;
  totalMaxDays: number;
  minDate: string;
  maxDate: string;
  stages: EtaStage[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** 当前本地日期，格式 yyyy-mm-dd。 */
export function todayDateOnly(now = new Date()): string {
  return formatDateOnly(now);
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string): Date | null {
  if (!DATE_ONLY.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/**
 * 从提交日期叠加各阶段天数区间，估算拿到贴签护照的日期区间。
 * 纯函数；无效日期返回 null。各阶段属性（官方/经验）原样带出供 UI 标注。
 */
export function estimateEta(
  submitDateISO: string,
  stages: EtaStage[],
): EtaEstimate | null {
  const base = parseDateOnly(submitDateISO);
  if (!base) return null;

  const totalMinDays = stages.reduce((sum, stage) => sum + stage.minDays, 0);
  const totalMaxDays = stages.reduce((sum, stage) => sum + stage.maxDays, 0);

  return {
    submitDate: submitDateISO,
    totalMinDays,
    totalMaxDays,
    minDate: formatDateOnly(addDays(base, totalMinDays)),
    maxDate: formatDateOnly(addDays(base, totalMaxDays)),
    stages: stages.map((stage) => ({ ...stage })),
  };
}
