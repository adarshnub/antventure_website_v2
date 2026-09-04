import { NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/contact";

const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const bucket = attempts.get(ip);
  if (bucket && bucket.reset > now && bucket.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  attempts.set(ip, !bucket || bucket.reset <= now ? { count: 1, reset: now + WINDOW_MS } : { ...bucket, count: bucket.count + 1 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact details" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const destination = process.env.CONTACT_WEBHOOK_URL;
  if (!destination) {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Contact service is not configured" }, { status: 500 });
    return NextResponse.json({ ok: true, development: true });
  }

  try {
    const response = await fetch(destination, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Webhook rejected the request");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to deliver message" }, { status: 500 });
  }
}
