import { redirect } from "next/navigation";

/** 国家选择已并入入口页（身份与国家同屏），旧地址重定向保留。 */
export default function CountriesPage() {
  redirect("/start");
}
