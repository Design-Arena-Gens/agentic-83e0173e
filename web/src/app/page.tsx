import { OperationalOverview } from "@/components/OperationalOverview";
import { PhoneAutomationCard } from "@/components/PhoneAutomationCard";
import { QuoteForm } from "@/components/QuoteForm";
import { TrackingForm } from "@/components/TrackingForm";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-16">
      <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-sm md:grid-cols-[3fr,2fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            Logistics AI · Voice + TMS integrated
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            A freight agent that answers every call, quotes from your TMS, and tracks every load.
          </h1>
          <p className="text-base text-slate-600">
            Velocity runs on top of your existing transportation management system. Phone, web, and SMS requests all tap
            into the same pricing engine and shipment feed so reps stay focused on exceptions.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              href="#quote"
            >
              Generate a live quote
            </a>
            <a
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              href="#track"
            >
              Track customer load
            </a>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Avg response time</dt>
              <dd className="text-lg font-semibold text-slate-900">3.7s</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Carrier coverage</dt>
              <dd className="text-lg font-semibold text-slate-900">LTL + FTL</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Channels</dt>
              <dd className="text-lg font-semibold text-slate-900">Voice · Web · SMS</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Phone workflow</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">“Thanks for calling Velocity”</p>
              <p className="text-xs text-slate-500">Press 1 for quotes, 2 for tracking.</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Instant quote</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Carrier: Skyline Expedited</p>
              <p className="text-xs text-slate-500">All-in: $1,487.56 · Transit: 3 days</p>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-4 text-xs text-slate-500">
              Hook into project44, MercuryGate, or your custom TMS via the `/api/quotes` endpoint.
            </div>
          </div>
        </div>
      </section>

      <section id="quote">
        <QuoteForm />
      </section>

      <section className="grid gap-10 lg:grid-cols-[3fr,2fr]">
        <div id="track">
          <TrackingForm />
        </div>
        <PhoneAutomationCard />
      </section>

      <OperationalOverview />
    </main>
  );
}
