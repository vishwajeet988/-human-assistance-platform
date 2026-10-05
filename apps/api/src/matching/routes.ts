import type { FastifyInstance, FastifyRequest } from "fastify";
import { z, ZodError } from "zod";
import { config } from "../config.js";
import { AppError, forbidden, unauthorized } from "../errors.js";
import { customerStore } from "../customer/store.js";
import { matchingService } from "./service.js";
import { providerRepository } from "../provider/repository.js";

const declineSchema = z.object({ reason: z.enum(["unavailable", "schedule conflict", "outside service area", "not comfortable", "other"]) });
function parse<T>(schema: z.ZodType<T>, value: unknown) { try { return schema.parse(value); } catch (error) { if (error instanceof ZodError) throw new AppError("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400); throw error; } }
function providerId(request: FastifyRequest) { const value = request.headers["x-provider-id"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "provider-demo-incomplete"; throw unauthorized(); }
function role(request: FastifyRequest) { const value = request.headers["x-role"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "ADMIN"; throw unauthorized(); }
function admin(request: FastifyRequest, action = false) { const current = role(request); if (action ? current !== "ADMIN" : !["ADMIN", "SUPPORT"].includes(current)) throw forbidden(); return typeof request.headers["x-actor-id"] === "string" ? request.headers["x-actor-id"] : current === "ADMIN" ? "admin-demo" : "support-demo"; }
function customerId(request: FastifyRequest) { const value = request.headers["x-customer-id"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "customer-demo"; throw unauthorized(); }

export function registerMatchingRoutes(app: FastifyInstance) {
  app.get("/api/v1/provider/requests", async (request) => ({ data: await Promise.all((await matchingService.listProviderRequests(providerId(request))).map(async (item) => { const detail = await matchingService.requestForProvider(providerId(request), item.id); return { ...detail.request, booking: detail.booking }; })) }));
  app.get<{ Params: { id: string } }>("/api/v1/provider/requests/:id", async (request) => ({ data: await matchingService.requestForProvider(providerId(request), request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/provider/requests/:id/view", async (request) => ({ data: await matchingService.viewRequest(providerId(request), request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/provider/requests/:id/accept", async (request) => ({ data: await matchingService.accept(providerId(request), request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/provider/requests/:id/decline", async (request) => ({ data: await matchingService.decline(providerId(request), request.params.id, parse(declineSchema, request.body).reason) }));

  app.get<{ Params: { id: string } }>("/api/v1/customer/bookings/:id/assignment", async (request) => ({ data: await matchingService.assignmentForCustomer(customerId(request), request.params.id) }));

  app.get("/api/v1/admin/matching/bookings", async (request) => ({ data: customerStore.listAllBookings().map((booking) => ({ id: booking.id, reference: booking.reference, state: booking.state, serviceName: booking.serviceName, assignedProviderId: booking.assignedProviderId })), meta: { role: admin(request) } }));
  app.get<{ Params: { id: string } }>("/api/v1/admin/matching/bookings/:id", async (request) => ({ data: await matchingService.adminMatching(request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/admin/bookings/:id/retry-matching", async (request) => ({ data: await matchingService.startMatching(request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/admin/bookings/:id/assign-provider", async (request) => { const input = parse(z.object({ providerId: z.string().min(1) }), request.body); return { data: await matchingService.manualAssign(admin(request, true), request.params.id, input.providerId) }; });
  app.post<{ Params: { id: string } }>("/api/v1/admin/bookings/:id/cancel-requests", async (request) => { admin(request, true); await providerRepository.cancelRequests(request.params.id); return { data: { cancelled: true } }; });
}
