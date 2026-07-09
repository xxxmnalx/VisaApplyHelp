import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://visa-apply-help.vercel.app",
  ),
  title: {
    default: "在美华人第三国签证步骤助手",
    template: "%s｜签证步骤助手",
  },
  description:
    "面向在美中国护照持有者的第三国签证逐步申请助手。支持 F-1 与 H-1B 身份申请加拿大、日本、韩国签证。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "在美华人第三国签证步骤助手",
    description: "通过身份配置、Checklist 和官方入口，逐步完成第三国签证申请。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * 根布局只负责字体与底色；页头页脚由各页面自带：
 * 入口页与流程页使用设计系统的页面级 chrome（通告条 / 流程页头 / 隐私页脚），
 * 首页与说明页显式引入 SiteHeader / SiteFooter。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
