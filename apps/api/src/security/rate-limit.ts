import type { FastifyInstance, FastifyRequest } from "fastify";

type Bucket = { count: number; resetAt: number };

// This is intentionally a small development fallback. Production deployments
// must enforce the same limits at the edge or replace this with a shared store.
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMITS: Array<[RegExp, number]> = [
  [/\/auth|\/otp|\/login/i, 10],
  [/\/payments|\/webhook/i, 60],
  [/\/bookings/i, 60]
];

function limitFor(url: string) {
  return LIMITS.find(([pattern]) => pattern.test(url))?.[1];
}

export function registerRateLimit(app: FastifyInstance) {
  app.addHook("onRequest", async (request: FastifyRequest, reply) => {
    const limit = limitFor(request.url);
    if (!limit) return;
    const key = `${request.ip}:${request.url.split("?")[0]}`;
    const now = Date.now();
    const existing = buckets.get(key);
    const bucket = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + WINDOW_MS }
      : existing;
    bucket.count += 1;
    buckets.set(key, bucket);
    reply.header("X-RateLimit-Limit", String(limit));
    reply.header("X-RateLimit-Remaining", String(Math.max(0, limit - bucket.count)));
    if (bucket.count > limit) {
      reply.header("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return reply.code(429).send({ error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } });
    }
  });
}
