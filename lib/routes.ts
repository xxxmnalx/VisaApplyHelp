/**
 * 签证助手在 xxxmnalx.com 下的路由前缀。
 * 域名根路径（/）留给个人主页；本站全部页面挂在该前缀下。
 */
export const VISAAPPLY_BASE_PATH = "/project/visaapply";

/** 拼接签证助手内部路径：visaapplyPath("/start") → "/project/visaapply/start"。 */
export function visaapplyPath(subPath = ""): string {
  return `${VISAAPPLY_BASE_PATH}${subPath}`;
}
