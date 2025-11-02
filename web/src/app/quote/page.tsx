import Link from "next/link";

import { QuoteForm } from "@/components/QuoteForm";

export default function QuotePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 pb-24 pt-16">
      <div className="space-y-3">
        <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">On-demand freight quoting</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Captures shipper profile details and pushes quotes straight to the TMS. The same engine powers the phone agent
          so everyone hears the same numbers.
        </p>
      </div>
      <QuoteForm />
    </main>
  );
}
