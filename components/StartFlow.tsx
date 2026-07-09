"use client";

import { useEffect, useState } from "react";
import { IdentitySelector } from "@/components/IdentitySelector";
import { UsageAgreement } from "@/components/UsageAgreement";
import { LocalUserIdentityRepository } from "@/lib/repositories/local-flow-repository";

type StartPhase = "loading" | "agreement" | "identity";

export function StartFlow() {
  const [phase, setPhase] = useState<StartPhase>("loading");
  const [consentAcceptedAt, setConsentAcceptedAt] = useState<string | null>(
    null,
  );
  const [existingStatusCode, setExistingStatusCode] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isActive = true;

    async function load() {
      // 回访用户：已同意过须知则直接进入身份确认，并预选上次身份。
      const identity = await new LocalUserIdentityRepository().load();
      if (!isActive) return;
      if (identity) {
        setConsentAcceptedAt(identity.consentAcceptedAt);
        setExistingStatusCode(identity.statusCode);
        setPhase("identity");
      } else {
        setPhase("agreement");
      }
    }

    void load();
    return () => {
      isActive = false;
    };
  }, []);

  if (phase === "loading") {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        正在加载……
      </p>
    );
  }

  if (phase === "agreement" || !consentAcceptedAt) {
    return (
      <UsageAgreement
        onAgree={() => {
          setConsentAcceptedAt(new Date().toISOString());
          setPhase("identity");
        }}
      />
    );
  }

  return (
    <IdentitySelector
      consentAcceptedAt={consentAcceptedAt}
      initialStatusCode={existingStatusCode}
    />
  );
}
