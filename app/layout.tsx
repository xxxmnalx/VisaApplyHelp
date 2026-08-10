import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xxxmnalx.com",
  ),
  title: "Leyang Cheng · 个人主页",
  description: "Leyang Cheng 的个人主页与项目集。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "Leyang Cheng · 个人主页",
    description: "Leyang Cheng 的个人主页与项目集。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * 根布局只负责字体与底色；页头页脚由各页面自带。
 * 域名根路径是个人主页，签证助手整体挂在 /project/visaapply 下，
 * 其站点级 metadata 由对应段级布局提供。
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
