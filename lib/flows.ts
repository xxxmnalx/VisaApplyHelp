import { caTrvF1Flow, caTrvH1bFlow } from "@/config/flows/ca-trv";
import { jpVisitorF1Flow, jpVisitorH1bFlow } from "@/config/flows/jp-evisa";
import { krVisitorF1Flow, krVisitorH1bFlow } from "@/config/flows/kr-visitor";
import type {
  FlowConfig,
  FlowStep,
  FlowTask,
  OfficialSource,
} from "@/lib/flow-types";

const flows: FlowConfig[] = [
  caTrvF1Flow,
  jpVisitorF1Flow,
  krVisitorF1Flow,
  caTrvH1bFlow,
  jpVisitorH1bFlow,
  krVisitorH1bFlow,
];

export function listFlows(): FlowConfig[] {
  return [...flows];
}

export function getFlow(flowId: string): FlowConfig | null {
  return flows.find((flow) => flow.id === flowId) ?? null;
}

export function getFlowByRoute(
  countrySlug: string,
  visaTypeSlug: string,
  statusSlug: string,
): FlowConfig | null {
  return (
    flows.find(
      (flow) =>
        flow.countrySlug === countrySlug &&
        flow.visaTypeSlug === visaTypeSlug &&
        flow.statusSlug === statusSlug,
    ) ?? null
  );
}

/** 某个身份可申请的全部国家流程（身份先行 → 国家选择页使用）。 */
export function listFlowsForStatus(statusCode: string): FlowConfig[] {
  return flows.filter((flow) => flow.status === statusCode);
}

export function getFlowPath(flow: FlowConfig): string {
  return `/apply/${flow.countrySlug}/${flow.visaTypeSlug}/${flow.statusSlug}`;
}

export function getStepPath(flow: FlowConfig, stepSlug: string): string {
  return `${getFlowPath(flow)}/${stepSlug}`;
}

export function getFlowStaticParams(): Array<{
  country: string;
  visaType: string;
  status: string;
  step: string;
}> {
  return flows.flatMap((flow) =>
    flow.steps.map((step) => ({
      country: flow.countrySlug,
      visaType: flow.visaTypeSlug,
      status: flow.statusSlug,
      step: step.slug,
    })),
  );
}

export function getFlowStep(
  flow: FlowConfig,
  stepSlug: string,
): FlowStep | null {
  return flow.steps.find((step) => step.slug === stepSlug) ?? null;
}

export function getStepSources(
  flow: FlowConfig,
  step: FlowStep,
): OfficialSource[] {
  const ids = new Set(step.officialLinkIds ?? []);
  return flow.sources.filter((source) => ids.has(source.id));
}

export function getTaskSources(
  flow: FlowConfig,
  task: FlowTask,
): OfficialSource[] {
  const ids = new Set(task.sourceIds ?? []);
  return flow.sources.filter((source) => ids.has(source.id));
}

export function getAdjacentSteps(
  flow: FlowConfig,
  step: FlowStep,
): { previous: FlowStep | null; next: FlowStep | null } {
  const index = flow.steps.findIndex((candidate) => candidate.id === step.id);
  return {
    previous: index > 0 ? flow.steps[index - 1] : null,
    next: index >= 0 && index < flow.steps.length - 1 ? flow.steps[index + 1] : null,
  };
}
