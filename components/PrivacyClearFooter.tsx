"use client";

type PrivacyClearFooterProps = {
  /** 点击「清除全部数据」后的动作；确认弹窗由调用方负责（语境不同措辞不同）。 */
  onClear: () => void;
};

/** 页脚隐私声明 + 一键清除：红色仅此一处。 */
export function PrivacyClearFooter({ onClear }: PrivacyClearFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line-soft pb-5 pt-3.5">
      <p className="text-[11.5px] leading-normal text-ink-mute">
        进度只保存在这台设备的浏览器里，
        <br />
        不上传任何服务器。
      </p>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded-lg border border-danger-edge bg-white px-3 py-2 text-xs text-danger transition hover:bg-danger-fill"
      >
        清除全部数据
      </button>
    </div>
  );
}
