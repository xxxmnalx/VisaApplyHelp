"use client";

import { useEffect, useState } from "react";
import type { Material } from "@/lib/types";

type MaterialChecklistProps = {
  materials: Material[];
  storageKey: string;
};

export default function MaterialChecklist({ materials, storageKey }: MaterialChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch {
        // ignore malformed storage
      }
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey, hydrated]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = materials.filter((m) => checked[m.id]).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">材料清单</h2>
        <span className="text-xs text-neutral-500">
          {doneCount} / {materials.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {materials.map((m) => {
          const isChecked = !!checked[m.id];
          return (
            <li key={m.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 px-3 py-3 hover:bg-neutral-50">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(m.id)}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm ${isChecked ? "text-neutral-400 line-through" : ""}`}>
                    {m.name}
                  </div>
                  {m.note && (
                    <div className="mt-0.5 text-xs text-neutral-500">{m.note}</div>
                  )}
                  {m.link && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-blue-600 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      官方链接 ↗
                    </a>
                  )}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
