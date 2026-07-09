/** 某货币兑美元的参考汇率与数据日期。 */
export type UsdRate = {
  rate: number;
  /** 汇率数据日期（yyyy-mm-dd）；USD 自身为空串。 */
  date: string;
};

/**
 * 取某货币兑 USD 的当前参考汇率（Frankfurter API，欧洲央行数据，无需密钥）。
 * 仅用于费用的「约合美元」参考展示；失败返回 null，由 UI 静默降级。
 * 不发送任何用户数据。
 */
export async function fetchUsdRate(currency: string): Promise<UsdRate | null> {
  if (currency === "USD") return { rate: 1, date: "" };
  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(currency)}&symbols=USD`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      date?: unknown;
      rates?: { USD?: unknown };
    };
    const rate = data.rates?.USD;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      return null;
    }
    return { rate, date: typeof data.date === "string" ? data.date : "" };
  } catch {
    return null;
  }
}
