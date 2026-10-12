// lib/ratelimit.ts (server)
// Production: distributed limiter via Upstash Redis REST (edge-safe).
// Dev/no-Upstash: in-memory fixed-window fallback (per-instance, best effort).
type Result = { success: boolean; remaining: number };

const WINDOW_MS = 60_000;
const MAX = 8; // requests per window per ip+key

const mem = new Map<string, { count: number; reset: number }>();

function memLimit(id: string): Result {
  const now = Date.now();
  const e = mem.get(id);
  if (!e || now > e.reset) {
    mem.set(id, { count: 1, reset: now + WINDOW_MS });
    return { success: true, remaining: MAX - 1 };
  }
  if (e.count >= MAX) return { success: false, remaining: 0 };
  e.count += 1;
  return { success: true, remaining: MAX - e.count };
}

async function upstashLimit(id: string): Promise<Result> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const key = `rl:${id}:${Math.floor(Date.now() / WINDOW_MS)}`;
  // INCR then EXPIRE via Upstash REST pipeline.
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, "60"]]),
  });
  const data = (await res.json()) as Array<{ result: number }>;
  const count = data?.[0]?.result ?? 1;
  return { success: count <= MAX, remaining: Math.max(0, MAX - count) };
}

export async function rateLimit(ip: string, key: string): Promise<Result> {
  const id = `${key}:${ip}`;
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return await upstashLimit(id);
    }
  } catch (err) {
    console.error("[ratelimit] upstash error, falling back to memory", err);
  }
  return memLimit(id);
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}