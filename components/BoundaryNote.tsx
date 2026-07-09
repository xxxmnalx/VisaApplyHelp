type BoundaryNoteProps = {
  /** 边界声明文案，默认一行本站边界。 */
  children?: React.ReactNode;
};

/** 一行边界声明：小而常驻，2px 左描边、不抢视线。 */
export function BoundaryNote({
  children = "本站不代办，也不代替官方作出决定。",
}: BoundaryNoteProps) {
  return (
    <p className="border-l-2 border-line pl-2.5 text-xs leading-relaxed text-ink-mute">
      {children}
    </p>
  );
}
