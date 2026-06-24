import type { MetadataRoute } from "next";
import { getDefaultFlow } from "@/lib/flows";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://visa-apply-help.vercel.app";
  const flow = getDefaultFlow();

  const staticPages = ["", "/start", "/about", "/privacy"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(flow.lastVerified),
  }));
  const flowPages = flow.steps.map((step) => ({
    url: `${baseUrl}/apply/ca/visitor/f1/${step.slug}`,
    lastModified: new Date(flow.lastVerified),
  }));

  return [...staticPages, ...flowPages];
}
