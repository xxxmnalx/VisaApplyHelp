import type { Config } from "tailwindcss";

/**
 * 「路径感 · Wayfinding Calm」视觉系统 tokens。
 * 规则：绿色只给「操作与进度」，琥珀只给「有期限的事实」，红仅保留给「清除数据」一处；
 * 无渐变、无第二强调色，1px 描边分层，阴影近乎为零。
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** 全站唯一强调色：深杉绿（主操作 / 完成态 / 当前节点）。 */
        pine: {
          DEFAULT: "#16594B",
          deep: "#0E4237",
          tint: "#E7F0EC",
          edge: "#C6DAD1",
        },
        /** 文字层级。 */
        ink: {
          DEFAULT: "#1D2521",
          soft: "#566059",
          mute: "#7E8781",
          faint: "#A6ADA7",
        },
        /** 描边层级：卡片描边 / 区块分隔 / 行分隔。 */
        line: {
          DEFAULT: "#E3E2DA",
          soft: "#EDECE5",
          faint: "#F2F1EA",
        },
        /** 页面纸面底色与 chip 底色。 */
        paper: {
          DEFAULT: "#F6F5F1",
          bright: "#FBFBF8",
        },
        /** 死线琥珀：只用于「有期限的事实」，陈述期限、不倒数、不闪烁。 */
        deadline: {
          fill: "#FAF3DF",
          edge: "#E9DCB4",
          ink: "#7A5B12",
        },
        /** 红仅保留给「清除数据」一处。 */
        danger: {
          DEFAULT: "#8C3A2E",
          edge: "#E0CFC9",
          fill: "#FAF4F2",
        },
        /** 里程碑与 Checklist 的结构色：未来节点描边 / 连接线 / 复选框描边 / 不适用底。 */
        node: {
          edge: "#C6CDC6",
          track: "#E0E0D8",
          box: "#A9B1AB",
          na: "#EDECE5",
          naedge: "#D8D8CE",
          dash: "#D5D4CB",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        /** 全站唯一投影：0 1px 2px / 4%。 */
        card: "0 1px 2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
