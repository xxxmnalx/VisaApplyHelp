type FlowProgressProps = {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
};

export function FlowProgress({
  currentStep,
  totalSteps,
  completionPercentage,
}: FlowProgressProps) {
  return (
    <section aria-label="流程进度" className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>
          第 {currentStep} / {totalSteps} 步
        </span>
        <span>本站流程完成度 {completionPercentage}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width]"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </section>
  );
}
