"use client";

import { useEffect, useState } from "react";

type StoredQuote = {
  reference: string;
  carrier: string;
  total: number;
  transitDays: number;
  createdAt: string;
  shipper: {
    company: string;
    contactName: string;
  };
  request: {
    originPostalCode: string;
    destinationPostalCode: string;
    weightLbs: number;
    serviceLevel: string;
  };
};

type Shipment = {
  trackingNumber: string;
  status: string;
  eta: string;
  lastUpdated: string;
  carrier: string;
  customerName: string;
};

export function OperationalOverview() {
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/quotes", { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setQuotes(payload.quotes ?? []))
      .catch(() => undefined);

    fetch("/api/shipments", { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setShipments(payload.shipments ?? []))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent quotes</h3>
          <span className="text-xs text-slate-400">Voice + Web generated</span>
        </div>
        <div className="mt-4 space-y-4">
          {quotes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No quotes yet. Generate one to sync with phone automation instantly.
            </p>
          ) : (
            quotes.map((quote) => (
              <div key={quote.reference} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{quote.shipper.company}</p>
                    <p className="text-xs text-slate-500">
                      {quote.request.originPostalCode} ➜ {quote.request.destinationPostalCode} ·{" "}
                      {quote.request.serviceLevel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">${quote.total.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{quote.carrier}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Transit {quote.transitDays} day(s)</span>
                  <span>Ref {quote.reference}</span>
                  <span>{new Date(quote.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Live shipments</h3>
          <span className="text-xs text-slate-400">Synced from TMS</span>
        </div>
        <div className="mt-4 space-y-4">
          {shipments.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No shipments staged yet. Quotes convert to loads automatically.
            </p>
          ) : (
            shipments.map((shipment) => (
              <div key={shipment.trackingNumber} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{shipment.customerName}</p>
                    <p className="text-xs text-slate-500">
                      {shipment.carrier} · ETA {new Date(shipment.eta).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{shipment.status}</p>
                    <p className="text-xs text-slate-500">
                      Updated {new Date(shipment.lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">Tracking {shipment.trackingNumber}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
