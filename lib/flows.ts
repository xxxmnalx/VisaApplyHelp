import fs from "node:fs";
import path from "node:path";
import type { CountryCode, Flow, Material, UsStatus } from "./types";

const FLOWS_DIR = path.join(process.cwd(), "data", "flows");

export function getFlow(flowId: string): Flow | null {
  const file = path.join(FLOWS_DIR, `${flowId}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as Flow;
}

export function listFlowsByCountry(country: CountryCode): Flow[] {
  if (!fs.existsSync(FLOWS_DIR)) return [];
  return fs
    .readdirSync(FLOWS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(FLOWS_DIR, file), "utf8")) as Flow)
    .filter((flow) => flow.country === country);
}

export function filterMaterialsByStatus(materials: Material[], status: UsStatus): Material[] {
  return materials.filter((m) => m.forStatus === "*" || m.forStatus.includes(status));
}
