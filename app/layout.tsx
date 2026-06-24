import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://visa-apply-help.vercel.app",
  ),
  title: {
    default: "在美华人第三国签证步骤助手",
    template: "%s｜签证步骤助手",
  },
  description:
    "面向在美中国护照持有者的第三国签证逐步申请助手。0.1 版本支持 F-1 学生申请加拿大访客签证。",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
