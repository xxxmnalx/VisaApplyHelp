/**
 * 本应用作为 xxxmnalx.com 下的一个 zone 部署：域名壳（xxxmnalx-com 仓库）
 * 把 /project/visaapply/* 反代到本应用的独立部署，前缀由 next.config.mjs
 * 的 basePath 统一注入。
 */

/**
 * 应用内路由前缀，固定为空：basePath 已经把 /project/visaapply 加到
 * next/link、router 与 /_next/* 静态资源上，应用内链接不能再自己带一遍。
 * 保留这个常量而不是删掉，是为了 getFlowPath 等拼接点仍有单一改写入口。
 */
export const VISAAPPLY_BASE_PATH = "";

/**
 * 对外绝对 URL 的路径前缀。basePath 只作用于运行时路由，
 * 不会加进 sitemap、metadata 里自己拼的绝对 URL，那些地方必须显式带上。
 */
export const VISAAPPLY_PUBLIC_PREFIX = "/project/visaapply";

/** 站点对外 origin。Vercel 上通过 NEXT_PUBLIC_SITE_URL 覆盖（预览环境用预览域名）。 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xxxmnalx.com";

/** 拼接应用内路径：visaapplyPath("/start") → "/start"，由 basePath 补足前缀。 */
export function visaapplyPath(subPath = "/"): string {
  return `${VISAAPPLY_BASE_PATH}${subPath}`;
}

/**
 * 拼接对外绝对 URL：visaapplyUrl("/start")
 * → "https://www.xxxmnalx.com/project/visaapply/start"。只给 sitemap / metadata 用。
 */
export function visaapplyUrl(subPath = ""): string {
  return `${SITE_ORIGIN}${VISAAPPLY_PUBLIC_PREFIX}${subPath}`;
}
