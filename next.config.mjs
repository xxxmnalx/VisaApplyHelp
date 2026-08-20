import createMDX from "@next/mdx";

const withMDX = createMDX({});

/**
 * 本应用是 xxxmnalx.com 下的一个 zone，整体挂在 /project/visaapply 前缀。
 * basePath 会把前缀注入到路由与 /_next/* 静态资源上——域名壳按同样的前缀反代，
 * 少了它静态资源会打回壳并 404。
 *
 * 域名级的重定向（/start、/apply/* 等旧路径）与其他项目的反代都归壳，
 * 不在这里配置：这里的 source 会被 basePath 自动加上前缀，写在这里只会形成死循环。
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: "/project/visaapply",
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
