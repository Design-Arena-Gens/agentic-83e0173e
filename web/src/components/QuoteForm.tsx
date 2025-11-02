"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";

type QuotePayload = {
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  originPostalCode: string;
  destinationPostalCode: string;
  weightLbs: number;
  palletCount: number;
  freightClass: number;
  serviceLevel: "standard" | "expedited" | "express";
  liftGatePickup: boolean;
  liftGateDelivery: boolean;
  residentialPickup: boolean;
  residentialDelivery: boolean;
  insideDelivery: boolean;
};

type QuoteResult = {
  quote?: {
    total: number;
    baseRate: number;
    fuelSurcharge: number;
    accessorials: number;
    carrier: string;
    reference: string;
    transitDays: number;
    pickupCommitment: string;
  };
  error?: string;
};

const freightClasses = [50, 55, 60, 65, 70, 77, 85, 92, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];

const initialState: QuotePayload = {
  company: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  originPostalCode: "",
  destinationPostalCode: "",
  weightLbs: 1500,
  palletCount: 1,
  freightClass: 125,
  serviceLevel: "standard",
  liftGatePickup: false,
  liftGateDelivery: false,
  residentialPickup: false,
  residentialDelivery: false,
  insideDelivery: false,
};

export function QuoteForm() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const disableSubmit = useMemo(() => {
    return (
      !form.company ||
      !form.contactName ||
      !form.contactEmail ||
      !form.contactPhone ||
      !form.originPostalCode ||
      !form.destinationPostalCode ||
      form.weightLbs <= 0 ||
      form.palletCount <= 0
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const payload = await response.json();
          setError("Unable to generate quote. Please review your inputs and try again.");
          setResult({ error: payload.error ?? "Quote failed" });
          return;
        }

        const payload = (await response.json()) as QuoteResult;
        setResult(payload);
      } catch (err) {
        console.error(err);
        setError("Network error while generating quote.");
      }
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Instant Freight Quote</h2>
          <p className="text-sm text-slate-500">
            Connects to your TMS in real-time to deliver an auditable operations-approved quote.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          Voice &amp; Web Synced
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Company</label>
          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            placeholder="Acme Distribution"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Contact name</label>
          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.contactName}
            onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))}
            placeholder="Jamie Ortega"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Contact email</label>
          <input
            type="email"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.contactEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
            placeholder="ops@acme.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Contact phone</label>
          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.contactPhone}
            onChange={(event) => setForm((prev) => ({ ...prev, contactPhone: event.target.value }))}
            placeholder="+1 404 555 0124"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Origin postal code</label>
          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.originPostalCode}
            onChange={(event) => setForm((prev) => ({ ...prev, originPostalCode: event.target.value }))}
            placeholder="30301"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Destination postal code</label>
          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={form.destinationPostalCode}
            onChange={(event) => setForm((prev) => ({ ...prev, destinationPostalCode: event.target.value }))}
            placeholder="90001"
            required
          />
        </div>
        <div className="grid gap-2 lg:col-span-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Total weight (lbs)</label>
            <input
              type="number"
              min={100}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.weightLbs}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, weightLbs: Number(event.target.value) || prev.weightLbs }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Pallet count</label>
            <input
              type="number"
              min={1}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.palletCount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, palletCount: Number(event.target.value) || prev.palletCount }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Freight class</label>
            <select
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.freightClass}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, freightClass: Number(event.target.value) || prev.freightClass }))
              }
            >
              {freightClasses.map((value) => (
                <option key={value} value={value}>
                  NMFC {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Service level</label>
          <div className="flex gap-3">
            {(
              [
                { value: "standard", label: "Standard" },
                { value: "expedited", label: "Expedited" },
                { value: "express", label: "Express" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  form.serviceLevel === option.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, serviceLevel: option.value }))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Accessorials</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                { key: "liftGatePickup", label: "Lift gate pickup" },
                { key: "liftGateDelivery", label: "Lift gate delivery" },
                { key: "residentialPickup", label: "Residential pickup" },
                { key: "residentialDelivery", label: "Residential delivery" },
                { key: "insideDelivery", label: "Inside delivery" },
              ] as const
            ).map((option) => (
              <label key={option.key} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form[option.key]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [option.key]: event.target.checked } as QuotePayload))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={disableSubmit || isPending}
          className="rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 lg:col-span-2"
        >
          {isPending ? "Generating..." : "Generate quote"}
        </button>
      </form>
      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}
      {result?.quote ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-600">Quote summary</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">All-in rate</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">${result.quote.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Transit time</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{result.quote.transitDays} days</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Carrier</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{result.quote.carrier}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Reference</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{result.quote.reference}</p>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <dt>Line haul</dt>
              <dd>${result.quote.baseRate.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <dt>Fuel surcharge</dt>
              <dd>${result.quote.fuelSurcharge.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <dt>Accessorials</dt>
              <dd>${result.quote.accessorials.toFixed(2)}</dd>
            </div>
            <div className="flex flex-col rounded-xl bg-white px-4 py-3">
              <dt className="text-xs uppercase text-slate-500">Pickup commitment</dt>
              <dd className="text-sm font-medium text-slate-900">
                {new Date(result.quote.pickupCommitment).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
