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
};

export default withMDX(nextConfig);
