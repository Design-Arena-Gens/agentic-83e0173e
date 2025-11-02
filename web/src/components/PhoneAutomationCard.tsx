"use client";

import { useMemo } from "react";

export function PhoneAutomationCard() {
  const webhookUrl = useMemo(() => {
    if (typeof window === "undefined") return "{YOUR_DOMAIN}/api/voice";
    return `${window.location.origin}/api/voice`;
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-lg">
      <div className="rounded-3xl bg-slate-950/90 p-8">
        <div className="flex flex-col gap-4 text-slate-100">
          <span className="text-xs uppercase tracking-wide text-emerald-400">Voice automation</span>
          <h3 className="text-2xl font-semibold text-white">
            Phone agent that quotes, books, and tracks in the same TMS pipeline.
          </h3>
          <p className="text-sm text-slate-300">
            Drop this webhook into your Twilio voice number. The agent prompts shippers for origin, destination,
            weight, and service speed before generating a live rate. Option 2 verifies shipment status instantly.
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Voice webhook</p>
            <p className="mt-2 font-mono text-sm text-emerald-200">{webhookUrl}</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>- Option 1: Generates an auditable TMS quote with carrier, rate, and transit time</li>
            <li>- Option 2: Reads back real-time shipment milestones and delivery ETA</li>
            <li>- Voice and web channels share the same pricing and event data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
