import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowRunner } from "@/components/FlowRunner";
import {
  getAdjacentSteps,
  getFlowByRoute,
  getFlowStaticParams,
  getFlowStep,
  getStepSources,
} from "@/lib/flows";

type FlowStepPageProps = {
  params: {
    country: string;
    visaType: string;
    status: string;
    step: string;
  };
};

export function generateStaticParams() {
  return getFlowStaticParams();
}

export function generateMetadata({ params }: FlowStepPageProps): Metadata {
  const flow = getFlowByRoute(
    params.country,
    params.visaType,
    params.status,
  );
  const step = flow ? getFlowStep(flow, params.step) : null;
  if (!flow || !step) return {};

  return {
    title: `${step.title}｜${flow.countryName} ${flow.statusLabel} ${flow.visaType}`,
    description: step.summary,
  };
}

export default function FlowStepPage({ params }: FlowStepPageProps) {
  const flow = getFlowByRoute(
    params.country,
    params.visaType,
    params.status,
  );
  if (!flow) notFound();

  const step = getFlowStep(flow, params.step);
  if (!step) notFound();

  const sources = getStepSources(flow, step);
  const adjacent = getAdjacentSteps(flow, step);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <FlowRunner
        flow={flow}
        step={step}
        sources={sources}
        previousSlug={adjacent.previous?.slug ?? null}
        nextSlug={adjacent.next?.slug ?? null}
      />
    </main>
  );
}
