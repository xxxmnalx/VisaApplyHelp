import type { Metadata } from "next";

export const metadata: Metadata = {
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

/** 签证助手段级布局：只承载本项目的 metadata，页面结构由各页自带。 */
export default function VisaApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
