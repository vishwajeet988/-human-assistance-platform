import type { FastifyInstance, FastifyRequest } from "fastify";
import { z, ZodError } from "zod";
import { config } from "../config.js";
import { AppError, forbidden, unauthorized } from "../errors.js";
import { paymentService } from "./service.js";
function customerId(request: FastifyRequest) { const value = request.headers["x-customer-id"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "customer-demo"; throw unauthorized(); }
function role(request: FastifyRequest) { const value = request.headers["x-role"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "ADMIN"; throw unauthorized(); }
function parse<T>(schema: z.ZodType<T>, value: unknown) { try { return schema.parse(value); } catch (error) { if (error instanceof ZodError) throw new AppError("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400); throw error; } }
const verifySchema = z.object({ paymentId: z.string().min(1), signature: z.string().min(16) });
export function registerPaymentRoutes(app: FastifyInstance) {
  app.post<{ Params: { id: string } }>("/api/v1/bookings/:id/payment", async (request, reply) => { const key = request.headers["idempotency-key"]; if (typeof key !== "string" || !key) throw new AppError("IDEMPOTENCY_REQUIRED", "An idempotency key is required.", 400); const payment = paymentService.createOrder(customerId(request), request.params.id, key); return reply.code(201).send({ data: await paymentService.adapter.createOrder(payment) , meta: { paymentId: payment.id, status: payment.status } }); });
  app.post<{ Params: { id: string } }>("/api/v1/payments/:id/verify", async (request) => ({ data: paymentService.verify(customerId(request), request.params.id, parse(verifySchema, request.body)) }));
  app.get<{ Params: { id: string } }>("/api/v1/payments/:id", async (request) => ({ data: paymentService.get(customerId(request), request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/payments/:id/refund", async (request) => { const input = parse(z.object({ reason: z.string().trim().min(5).max(300) }), request.body); return { data: paymentService.refund(customerId(request), request.params.id, input.reason) }; });
  app.post("/api/v1/payments/webhook", async (request) => { const signature = request.headers["x-payment-signature"]; const eventId = request.headers["x-payment-event-id"]; if (typeof signature !== "string" || typeof eventId !== "string") throw unauthorized(); const body = request.body as { paymentId: string; orderId: string; status: "CAPTURED" | "FAILED" }; return { data: paymentService.webhook(JSON.stringify(body), signature, eventId, String(request.headers["x-payment-event"] ?? "payment.updated"), body) }; });
  app.get("/api/v1/admin/payments", async (request) => { if (!["ADMIN", "SUPPORT"].includes(role(request))) throw forbidden(); return { data: paymentService.listPayments() }; });
  app.get("/api/v1/admin/earnings", async (request) => { if (!["ADMIN", "SUPPORT"].includes(role(request))) throw forbidden(); return { data: paymentService.listEarnings() }; });
}
