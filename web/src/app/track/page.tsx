import Link from "next/link";

import { TrackingForm } from "@/components/TrackingForm";

export default function TrackPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 pb-24 pt-16">
      <div className="space-y-3">
        <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">Track customer freight in real-time</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Pulls milestones and ETAs directly from the TMS event stream. Works for live calls, web requests, and automated
          status digests.
        </p>
      </div>
      <TrackingForm />
    </main>
  );
}
