type BrandMarkProps = {
  /** 图标边长（px），默认 20。 */
  size?: number;
};

/** 品牌路径标：起点实心、终点空心、一条连线——「从这里到拿到签证」。 */
export function BrandMark({ size = 20 }: BrandMarkProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="4" cy="16" r="2.4" fill="#16594B" />
      <path d="M6 14.5 L14 5.5" stroke="#16594B" strokeWidth="2" />
      <circle cx="16" cy="4" r="2.4" fill="none" stroke="#16594B" strokeWidth="2" />
    </svg>
  );
}
