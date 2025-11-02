# Velocity Logistics Agent

Full-stack logistics assistant that syncs web, phone, and operations workflows. The agent can answer inbound calls, generate freight quotes from a TMS feed, and track customer shipments in real time.

## Features

- Voice workflow powered by Twilio webhook (`/api/voice`) for instant quotes and tracking
- Web portal for operations to create quotes, share pricing, and monitor live shipments
- In-memory TMS simulator with optional external HTTP integration via `TMS_API_URL`
- Shared quote + shipment store so phone and web channels stay aligned
- Tailwind UI with responsive dashboard experience

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to use the portal.

## Voice Automation Setup

1. Deploy the app (e.g. Vercel) and copy the public URL
2. In the Twilio console, configure your voice number with a webhook pointing to `{PUBLIC_URL}/api/voice`
3. Call the number:
   - Option 1 gathers origin, destination, weight, and service level then issues a live quote
   - Option 2 reads shipment status, last scan, and ETA from the shared TMS feed

## Integrating With A Live TMS

Set the following environment variables and redeploy:

```
TMS_API_URL=https://your-tms.example.com
TMS_API_KEY=abc123
```

When present, `/api/quotes` will POST quote requests to the external endpoint and fall back to the simulator if it fails.

## Deployment

This project is optimized for Vercel. After running `npm run build` locally, deploy with:

```
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-83e0173e
```

Ensure `VERCEL_TOKEN` is available in the environment before running the command.
