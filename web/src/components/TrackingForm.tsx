"use client";

import { FormEvent, useState } from "react";

type ShipmentEvent = {
  timestamp: string;
  location: string;
  status: string;
  notes?: string;
};

type ShipmentResponse = {
  shipment?: {
    trackingNumber: string;
    customerName: string;
    carrier: string;
    status: string;
    eta: string;
    lastUpdated: string;
    milestones: ShipmentEvent[];
    originPostalCode: string;
    destinationPostalCode: string;
  };
  error?: string;
};

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<ShipmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trackingNumber) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/shipments?tracking=${encodeURIComponent(trackingNumber)}`);
      if (!response.ok) {
        const payload = await response.json();
        setError(payload.error ?? "Shipment not found.");
        setResult(null);
        return;
      }

      const payload = (await response.json()) as ShipmentResponse;
      setResult(payload);
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve shipment status.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Track a shipment</h2>
          <p className="text-sm text-slate-500">
            Works with phone, SMS, and portal lookups. Pulls milestones directly from the TMS feed.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">Real-time</span>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value.toUpperCase())}
          required
        />
        <button
          type="submit"
          disabled={!trackingNumber || isLoading}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? "Fetching..." : "Track"}
        </button>
      </form>
      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}
      {result?.shipment ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Tracking</p>
              <p className="text-lg font-semibold text-slate-900">{result.shipment.trackingNumber}</p>
              <p className="text-sm text-slate-600">
                {result.shipment.originPostalCode} ➜ {result.shipment.destinationPostalCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="text-lg font-semibold text-emerald-600">{result.shipment.status}</p>
              <p className="text-xs text-slate-500">
                Updated {new Date(result.shipment.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {result.shipment.milestones
              .slice()
              .reverse()
              .map((event) => (
                <div key={event.timestamp} className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{event.status}</span>
                    <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>{event.location}</span>
                    {event.notes ? <span className="text-xs text-slate-500">{event.notes}</span> : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
