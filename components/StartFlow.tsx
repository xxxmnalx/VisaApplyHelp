"use client";

import { useState } from "react";
import { IdentitySelector } from "@/components/IdentitySelector";
import { UsageAgreement } from "@/components/UsageAgreement";
import type { FlowConfig } from "@/lib/flow-types";

type StartFlowProps = {
  flow: FlowConfig;
};

export function StartFlow({ flow }: StartFlowProps) {
  const [consentAcceptedAt, setConsentAcceptedAt] = useState<string | null>(
    null,
  );

  if (!consentAcceptedAt) {
    return (
      <UsageAgreement
        onAgree={() => setConsentAcceptedAt(new Date().toISOString())}
      />
    );
  }

  return <IdentitySelector flow={flow} consentAcceptedAt={consentAcceptedAt} />;
}
