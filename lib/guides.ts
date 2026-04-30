import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { CountryCode, GuideFrontmatter } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export type GuideMeta = GuideFrontmatter & { slug: string };

export function listGuides(country: CountryCode): GuideMeta[] {
  const dir = path.join(GUIDES_DIR, country.toLowerCase());
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return { ...(data as GuideFrontmatter), slug };
    })
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
}

export function getGuideSource(country: CountryCode, slug: string): string | null {
  const file = path.join(GUIDES_DIR, country.toLowerCase(), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}
