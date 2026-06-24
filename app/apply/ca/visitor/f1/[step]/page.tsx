import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowRunner } from "@/components/FlowRunner";
import {
  getAdjacentSteps,
  getDefaultFlow,
  getFlowStep,
  getStepSources,
} from "@/lib/flows";

type FlowStepPageProps = {
  params: { step: string };
};

export function generateStaticParams() {
  return getDefaultFlow().steps.map((step) => ({ step: step.slug }));
}

export function generateMetadata({ params }: FlowStepPageProps): Metadata {
  const flow = getDefaultFlow();
  const step = getFlowStep(flow, params.step);
  if (!step) return {};

  return {
    title: `${step.title}｜加拿大 F-1 访客签证`,
    description: step.summary,
  };
}

export default function FlowStepPage({ params }: FlowStepPageProps) {
  const flow = getDefaultFlow();
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
