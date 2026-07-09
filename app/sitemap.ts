import type { MetadataRoute } from "next";
import { getStepPath, listFlows } from "@/lib/flows";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://visa-apply-help.vercel.app";
  const latestVerified = listFlows()
    .map((flow) => flow.lastVerified)
    .sort()
    .at(-1);
  const staticLastModified = latestVerified
    ? new Date(latestVerified)
    : new Date();

  const staticPages = ["", "/start", "/about", "/privacy"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: staticLastModified,
    }),
  );
  const flowPages = listFlows().flatMap((registeredFlow) =>
    registeredFlow.steps.map((step) => ({
      url: `${baseUrl}${getStepPath(registeredFlow, step.slug)}`,
      lastModified: new Date(registeredFlow.lastVerified),
    })),
  );

  return [...staticPages, ...flowPages];
}
