import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async rewrites() {
    return [
      // 骰迹玩法测试原型,独立部署在 rapid-demo-testing 项目
      { source: "/game/demo", destination: "https://rapid-demo-testing.vercel.app/index.html" },
      // 兜底:demo 页面内的相对路径资源(style.css / app.js)会解析到 /game/ 下
      { source: "/game/:path*", destination: "https://rapid-demo-testing.vercel.app/:path*" },
    ];
  },
  async redirects() {
    // 签证助手 2026-08 起整体迁至 /project/visaapply，根路径改为个人主页；
    // 旧书签与外链统一转到新位置（含更早版本遗留的 /ca /jp /kr /countries 入口）。
    return [
      { source: "/start", destination: "/project/visaapply/start", permanent: false },
      { source: "/apply/:path*", destination: "/project/visaapply/apply/:path*", permanent: false },
      { source: "/about", destination: "/project/visaapply/about", permanent: false },
      { source: "/privacy", destination: "/project/visaapply/privacy", permanent: false },
      { source: "/countries", destination: "/project/visaapply/start", permanent: false },
      { source: "/ca", destination: "/project/visaapply/start", permanent: false },
      { source: "/ca/:path*", destination: "/project/visaapply/start", permanent: false },
      { source: "/jp", destination: "/project/visaapply/start", permanent: false },
      { source: "/kr", destination: "/project/visaapply/start", permanent: false },
    ];
  },
};

export default withMDX(nextConfig);
