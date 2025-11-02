import { NextRequest, NextResponse } from "next/server";

import { generateQuote, listQuotes } from "@/lib/quotes";
import { quoteFormSchema } from "@/lib/validation";

export async function GET() {
  const quotes = listQuotes();
  return NextResponse.json({ quotes });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = quoteFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const {
    company,
    contactEmail,
    contactName,
    contactPhone,
    serviceLevel,
    freightClass,
    originPostalCode,
    destinationPostalCode,
    weightLbs,
    palletCount,
    liftGateDelivery,
    liftGatePickup,
    residentialDelivery,
    residentialPickup,
    insideDelivery,
  } = parsed.data;

  const quote = await generateQuote(
    {
      originPostalCode,
      destinationPostalCode,
      weightLbs,
      palletCount,
      serviceLevel,
      freightClass,
      accessorials: {
        liftGatePickup,
        liftGateDelivery,
        residentialPickup,
        residentialDelivery,
        insideDelivery,
      },
    },
    {
      company,
      contactEmail,
      contactName,
      contactPhone,
    },
  );

  return NextResponse.json({ quote });
}
