import type { Metadata } from "next";
import { StartFlow } from "@/components/StartFlow";

export const metadata: Metadata = {
  title: "开始申请",
  description:
    "确认当前美国身份并选择要申请的国家，同一屏两步完成，随后进入对应的第三国签证逐步流程。",
};

/** 入口页：身份与国家同屏（页面级 chrome 由 StartFlow 自带）。 */
export default function StartPage() {
  return <StartFlow />;
}
