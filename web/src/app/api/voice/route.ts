import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

import { getShipment } from "@/lib/shipments";
import { createQuote } from "@/lib/tms";

const { VoiceResponse } = twilio.twiml;

interface CallSession {
  originPostalCode?: string;
  destinationPostalCode?: string;
  weightLbs?: number;
}

const callSessions = new Map<string, CallSession>();

function getActionUrl(request: NextRequest, stage: string) {
  const url = new URL(request.url);
  url.searchParams.set("stage", stage);
  return url.toString();
}

function normalizeDigits(input?: string | null) {
  if (!input) return undefined;
  const digitsOnly = input.replace(/\D+/g, "");
  return digitsOnly.length ? digitsOnly : undefined;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = (formData.get("CallSid") as string | null) ?? "";
  const digits = (formData.get("Digits") as string | null) ?? undefined;
  const speechResult = (formData.get("SpeechResult") as string | null) ?? undefined;
  const stage = request.nextUrl.searchParams.get("stage") ?? "menu";
  const response = new VoiceResponse();
  const session = callSessions.get(callSid) ?? {};
  const numericInput = normalizeDigits(digits ?? speechResult);

  switch (stage) {
    case "menu": {
      const gather = response.gather({
        action: getActionUrl(request, "menuSelection"),
        method: "POST",
        input: ["dtmf", "speech"],
        numDigits: 1,
        timeout: 5,
      });
      gather.say(
        "Velocity Logistics. For a new freight quote, press or say 1. To track an existing shipment, press or say 2.",
      );
      response.redirect(getActionUrl(request, "menu"));
      break;
    }
    case "menuSelection": {
      if (numericInput === "1") {
        const gather = response.gather({
          action: getActionUrl(request, "quote_origin"),
          method: "POST",
          input: ["dtmf", "speech"],
          numDigits: 5,
          timeout: 6,
        });
        gather.say("Please enter the five digit origin zip code.");
        response.redirect(getActionUrl(request, "quote_origin"));
        break;
      }
      if (numericInput === "2") {
        const gather = response.gather({
          action: getActionUrl(request, "track_input"),
          method: "POST",
          input: ["dtmf", "speech"],
          numDigits: 12,
          timeout: 6,
        });
        gather.say("Please enter or say your shipment tracking number.");
        response.redirect(getActionUrl(request, "track_input"));
        break;
      }
      response.say("Sorry, I did not understand.");
      response.redirect(getActionUrl(request, "menu"));
      break;
    }
    case "quote_origin": {
      if (!numericInput) {
        response.say("I did not catch that origin zip code.");
        response.redirect(getActionUrl(request, "menu"));
        break;
      }
      session.originPostalCode = numericInput;
      callSessions.set(callSid, session);
      const gather = response.gather({
        action: getActionUrl(request, "quote_destination"),
        method: "POST",
        input: ["dtmf", "speech"],
        numDigits: 5,
        timeout: 6,
      });
      gather.say("Please enter the five digit destination zip code.");
      response.redirect(getActionUrl(request, "quote_destination"));
      break;
    }
    case "quote_destination": {
      if (!numericInput) {
        response.say("I did not catch that destination zip code.");
        response.redirect(getActionUrl(request, "quote_destination"));
        break;
      }
      session.destinationPostalCode = numericInput;
      callSessions.set(callSid, session);
      const gather = response.gather({
        action: getActionUrl(request, "quote_weight"),
        method: "POST",
        input: ["dtmf", "speech"],
        timeout: 6,
      });
      gather.say("Enter the total shipment weight in pounds.");
      response.redirect(getActionUrl(request, "quote_weight"));
      break;
    }
    case "quote_weight": {
      if (!numericInput) {
        response.say("Weight not received. Returning to main menu.");
        response.redirect(getActionUrl(request, "menu"));
        break;
      }
      session.weightLbs = parseInt(numericInput, 10);
      callSessions.set(callSid, session);
      const gather = response.gather({
        action: getActionUrl(request, "quote_service"),
        method: "POST",
        input: ["dtmf", "speech"],
        numDigits: 1,
        timeout: 6,
      });
      gather.say("For standard service press 1. Expedited press 2. Express press 3.");
      response.redirect(getActionUrl(request, "quote_service"));
      break;
    }
    case "quote_service": {
      const selection = numericInput?.[0];
      const serviceMap: Record<string, "standard" | "expedited" | "express"> = {
        "1": "standard",
        "2": "expedited",
        "3": "express",
      };
      const service = selection ? serviceMap[selection] : undefined;

      if (!service || !session.originPostalCode || !session.destinationPostalCode || !session.weightLbs) {
        response.say("Unable to complete quote. Returning to main menu.");
        response.redirect(getActionUrl(request, "menu"));
        break;
      }

      const quote = await createQuote({
        originPostalCode: session.originPostalCode,
        destinationPostalCode: session.destinationPostalCode,
        weightLbs: session.weightLbs,
        palletCount: Math.max(1, Math.round(session.weightLbs / 1200)),
        serviceLevel: service,
        freightClass: 125,
        accessorials: {},
      });

      response.say(
        `Your ${service} quote with ${quote.carrier} is ${quote.total.toFixed(
          2,
        )} dollars. Transit time ${quote.transitDays} days. Reference ${quote.reference}.`,
      );
      response.say("We have also sent the quote to the operations portal. Thank you for calling Velocity Logistics.");
      response.hangup();
      callSessions.delete(callSid);
      break;
    }
    case "track_input": {
      if (!numericInput) {
        response.say("Tracking number not received. Returning to main menu.");
        response.redirect(getActionUrl(request, "menu"));
        break;
      }
      const shipment = getShipment(numericInput);
      if (!shipment) {
        response.say("Shipment not found. Please verify the tracking number.");
        response.redirect(getActionUrl(request, "menu"));
        break;
      }
      const latestMilestone = shipment.milestones.at(-1);
      response.say(
        `Shipment ${shipment.trackingNumber} for ${shipment.customerName} is currently ${shipment.status}. ${
          latestMilestone
            ? `Last update ${new Date(latestMilestone.timestamp).toLocaleString("en-US", {
                timeZone: "UTC",
              })} at ${latestMilestone.location}.`
            : ""
        } Estimated delivery ${new Date(shipment.eta).toLocaleDateString("en-US", { timeZone: "UTC" })}.`,
      );
      response.say("Thank you for calling Velocity Logistics.");
      response.hangup();
      callSessions.delete(callSid);
      break;
    }
    default: {
      response.say("Transferring to the main menu.");
      response.redirect(getActionUrl(request, "menu"));
    }
  }

  return new NextResponse(response.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
