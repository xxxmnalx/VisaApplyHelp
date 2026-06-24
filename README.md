# VisaApplyHelp

面向持中国护照、居住在美国的非移民身份用户的第三国签证步骤助手。

项目不是传统攻略文章站。用户先确认美国身份，系统加载对应配置，再通过 Checklist、官方链接和本地进度记录，从准备申请一直走到收到签证。

## 当前版本

0.1 支持：

- 中国普通护照
- 年满 18 岁
- 美国 F-1 在读学生
- 从美国申请加拿大访客签证（TRV）

底层保留扩展到 OPT、H、J、M、L 等身份以及日本、韩国等目的地的能力。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 项目结构

```text
app/                 Next.js App Router 页面
components/          单文件 React 组件
config/flows/        身份与签证流程配置
lib/                 流程类型和读取逻辑
docs/                产品与流程规格
UPDATE.md            按时间倒序维护的修改记录
AGENTS.md            AI 与项目协作规范
```

## 数据与隐私

0.1 只使用浏览器 localStorage 保存身份选择、Checklist 状态和用户主动填写的流程日期。

本站不保存护照号、UCI、申请号、出生日期、银行资料、学校名称、申请表答案或上传文件。

## 协作

开始修改前请完整阅读：

1. `AGENTS.md`
2. `UPDATE.md`
3. 与任务相关的 `docs/*.md`
