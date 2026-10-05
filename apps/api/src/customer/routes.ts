import type { FastifyInstance, FastifyRequest } from "fastify";
import { z, ZodError } from "zod";
import { AppError, unauthorized } from "../errors.js";
import { config } from "../config.js";
import { customerStore } from "./store.js";
import { estimatePrice, validateScheduledStart } from "../catalog/pricing.js";
import { providerRepository } from "../provider/repository.js";
import { notificationService } from "../notifications/service.js";

const familySchema = z.object({ name: z.string().trim().min(2).max(100), relationship: z.string().trim().min(2).max(60), phone: z.string().trim().max(30).optional(), notes: z.string().trim().max(500).optional() });
const addressSchema = z.object({ label: z.string().trim().min(1).max(40), recipientName: z.string().trim().min(2).max(100), addressLine1: z.string().trim().min(3).max(150), addressLine2: z.string().trim().max(150).optional(), locality: z.string().trim().min(2).max(80), city: z.string().trim().min(2).max(80), state: z.string().trim().min(2).max(80), postalCode: z.string().trim().regex(/^\d{6}$/, "Enter a valid six-digit postal code."), instructions: z.string().trim().max(500).optional() });
const estimateSchema = z.object({ serviceSlug: z.string().trim().min(1), durationMinutes: z.number().int().positive() });
const bookingSchema = z.object({ familyMemberId: z.string().uuid().optional(), serviceSlug: z.string().trim().min(1), addressId: z.string().uuid(), scheduledStart: z.string(), durationMinutes: z.number().int().positive(), requirements: z.string().trim().max(1000).optional(), emergencyContact: z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().min(7).max(30) }).optional() });

function body<T>(schema: z.ZodType<T>, value: unknown): T { try { return schema.parse(value); } catch (error) { if (error instanceof ZodError) throw new AppError("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400); throw error; } }
function customerId(request: FastifyRequest) { const value = request.headers["x-customer-id"]; if (typeof value === "string" && value.length > 0) return value; if (config.NODE_ENV !== "production") return "customer-demo"; throw unauthorized(); }
function category(slug: string) { const item = customerStore.categories.find((candidate) => candidate.slug === slug && candidate.active); if (!item) throw new AppError("SERVICE_NOT_FOUND", "That service is not available.", 404); return item; }

export function registerCustomerRoutes(app: FastifyInstance) {
  app.get("/api/v1/services", async () => ({ data: customerStore.categories.filter((item) => item.active).sort((a, b) => a.displayOrder - b.displayOrder) }));
  app.get<{ Params: { slug: string } }>("/api/v1/services/:slug", async (request) => ({ data: category(request.params.slug) }));

  app.get("/api/v1/customer/family-members", async (request) => ({ data: customerStore.listFamilyMembers(customerId(request)) }));
  app.post("/api/v1/customer/family-members", async (request, reply) => reply.code(201).send({ data: customerStore.createFamilyMember(customerId(request), body(familySchema, request.body)) }));
  app.patch<{ Params: { id: string } }>("/api/v1/customer/family-members/:id", async (request) => ({ data: customerStore.updateFamilyMember(customerId(request), request.params.id, body(familySchema.partial(), request.body)) }));
  app.delete<{ Params: { id: string } }>("/api/v1/customer/family-members/:id", async (request, reply) => { customerStore.deleteFamilyMember(customerId(request), request.params.id); return reply.code(204).send(); });

  app.get("/api/v1/customer/addresses", async (request) => ({ data: customerStore.listAddresses(customerId(request)) }));
  app.post("/api/v1/customer/addresses", async (request, reply) => reply.code(201).send({ data: customerStore.createAddress(customerId(request), body(addressSchema, request.body)) }));
  app.patch<{ Params: { id: string } }>("/api/v1/customer/addresses/:id", async (request) => ({ data: customerStore.updateAddress(customerId(request), request.params.id, body(addressSchema.partial(), request.body)) }));
  app.delete<{ Params: { id: string } }>("/api/v1/customer/addresses/:id", async (request, reply) => { customerStore.deleteAddress(customerId(request), request.params.id); return reply.code(204).send(); });

  app.post("/api/v1/bookings/estimate", async (request) => { const input = body(estimateSchema, request.body); const service = category(input.serviceSlug); return { data: { service: { slug: service.slug, name: service.name }, durationMinutes: input.durationMinutes, ...estimatePrice(service, input.durationMinutes) } }; });
  app.post("/api/v1/bookings", async (request, reply) => {
    const actor = customerId(request); const input = body(bookingSchema, request.body); const service = category(input.serviceSlug);
    if (!customerStore.ownsFamilyMember(actor, input.familyMemberId)) throw new AppError("FORBIDDEN", "That family member is not available to this account.", 403);
    if (!customerStore.ownsAddress(actor, input.addressId)) throw new AppError("FORBIDDEN", "That address is not available to this account.", 403);
    validateScheduledStart(input.scheduledStart); const price = estimatePrice(service, input.durationMinutes);
    const booking = customerStore.createBooking({ customerId: actor, familyMemberId: input.familyMemberId, addressId: input.addressId, serviceSlug: service.slug, serviceName: service.name, scheduledStart: new Date(input.scheduledStart).toISOString(), durationMinutes: input.durationMinutes, requirements: input.requirements, emergencyContact: input.emergencyContact, estimateAmountMinor: price.totalMinor, currency: "INR", state: "PENDING_PAYMENT", idempotencyKey: request.headers["idempotency-key"] as string | undefined });
    notificationService.emit(actor, `booking-created:${booking.id}`, "Booking received", "Your assistance request was created.");
    return reply.code(201).send({ data: booking });
  });
  app.get("/api/v1/bookings", async (request) => ({ data: customerStore.listBookings(customerId(request)) }));
  app.get<{ Params: { id: string } }>("/api/v1/customer/family-members/:id/dashboard", async (request) => { const actor = customerId(request); const member = customerStore.getFamilyMember(actor, request.params.id); return { data: { member, bookings: customerStore.listBookings(actor).filter((booking) => booking.familyMemberId === member.id) } }; });
  app.get<{ Params: { id: string } }>("/api/v1/bookings/:id", async (request) => ({ data: customerStore.getBooking(customerId(request), request.params.id) }));
  app.post<{ Params: { id: string } }>("/api/v1/bookings/:id/cancel", async (request) => { const booking = customerStore.cancelBooking(customerId(request), request.params.id); await providerRepository.cancelRequests(booking.id); return { data: booking }; });
}
