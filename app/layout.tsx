import type { Metadata, Viewport } from "next";
import { visaapplyUrl } from "@/lib/routes";
import "./globals.css";

export const metadata: Metadata = {
  // 对外 URL 带 /project/visaapply 前缀；basePath 不作用于 metadata 里的绝对 URL。
  metadataBase: new URL(visaapplyUrl()),
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
 * 根布局只负责字体与底色；页头页脚由各页面自带。
 * 本应用整体挂在域名的 /project/visaapply 前缀下（见 next.config.mjs 的 basePath），
 * 域名根路径的个人主页由 xxxmnalx-com 仓库承载，不在本仓库。
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
