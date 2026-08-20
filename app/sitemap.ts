import type { MetadataRoute } from "next";
import { getStepPath, listFlows } from "@/lib/flows";
import { visaapplyUrl } from "@/lib/routes";

/**
 * 本 zone 只出自己的页面。域名根主页归域名壳的 sitemap，
 * 两份 sitemap 由壳的 robots.txt 一起登记给搜索引擎。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const latestVerified = listFlows()
    .map((flow) => flow.lastVerified)
    .sort()
    .at(-1);
  const staticLastModified = latestVerified
    ? new Date(latestVerified)
    : new Date();

  const staticPages = ["", "/start", "/about", "/privacy"].map((subPath) => ({
    url: visaapplyUrl(subPath),
    lastModified: staticLastModified,
  }));
  const flowPages = listFlows().flatMap((registeredFlow) =>
    registeredFlow.steps.map((step) => ({
      url: visaapplyUrl(getStepPath(registeredFlow, step.slug)),
      lastModified: new Date(registeredFlow.lastVerified),
    })),
  );

  return [...staticPages, ...flowPages];
}
