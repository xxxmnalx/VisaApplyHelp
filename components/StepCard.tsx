import type { Material, Step } from "@/lib/types";
import MaterialChecklist from "./MaterialChecklist";

type StepCardProps = {
  step: Step;
  index: number;
  total: number;
  materials: Material[];
  materialsStorageKey: string;
};

export default function StepCard({
  step,
  index,
  total,
  materials,
  materialsStorageKey,
}: StepCardProps) {
  return (
    <div>
      <div className="text-xs text-neutral-500">
        第 {index + 1} 步 / 共 {total} 步
      </div>
      <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
      {step.body && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {step.body}
        </p>
      )}
      {step.links && step.links.length > 0 && (
        <ul className="mt-4 space-y-1">
          {step.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
      {step.linkMaterials && (
        <div className="mt-5">
          <MaterialChecklist materials={materials} storageKey={materialsStorageKey} />
        </div>
      )}
    </div>
  );
}
