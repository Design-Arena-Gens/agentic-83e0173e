import { NextRequest, NextResponse } from "next/server";

import { getShipment, listShipments } from "@/lib/shipments";

export async function GET(request: NextRequest) {
  const trackingNumber = request.nextUrl.searchParams.get("tracking");
  if (trackingNumber) {
    const shipment = getShipment(trackingNumber);
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }
    return NextResponse.json({ shipment });
  }

  const shipments = listShipments();
  return NextResponse.json({ shipments });
}
