import type { FastifyInstance, FastifyRequest } from "fastify";
import { z, ZodError } from "zod";
import { config } from "../config.js";
import { AppError, forbidden, unauthorized } from "../errors.js";
import { seededCategories } from "../catalog/data.js";
import { providerRepository } from "./repository.js";
import { canEditProfile, validateAvailability } from "./rules.js";
import type { AvailabilityInput } from "./types.js";

const profileSchema = z.object({ displayName: z.string().trim().min(2).max(100).optional(), profilePhotoRef: z.string().trim().max(300).optional(), bio: z.string().trim().max(1000).optional(), gender: z.string().trim().max(40).optional(), languages: z.array(z.string().trim().min(2).max(40)).max(8).optional(), experienceSummary: z.string().trim().max(500).optional(), timezone: z.string().trim().min(3).max(80).optional() });
const serviceSchema = z.object({ serviceSlugs: z.array(z.string().trim().min(1)).max(20) });
const availabilitySchema = z.object({ kind: z.enum(["WEEKLY", "BLACKOUT"]), dayOfWeek: z.number().int().min(1).max(7).optional(), startTime: z.string().optional(), endTime: z.string().optional(), timezone: z.string().min(3), startsAt: z.string().optional(), endsAt: z.string().optional(), active: z.boolean().default(true) });
const documentSchema = z.object({ documentType: z.string().trim().min(2).max(60), storageRef: z.string().trim().min(3).max(500) });
const reasonSchema = z.object({ reason: z.string().trim().min(5).max(500) });
function parse<T>(schema: z.ZodType<T>, value: unknown): T { try { return schema.parse(value); } catch (error) { if (error instanceof ZodError) throw new AppError("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400); throw error; } }
function providerId(request: FastifyRequest) { const value = request.headers["x-provider-id"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "provider-demo-incomplete"; throw unauthorized(); }
function actorRole(request: FastifyRequest) { const value = request.headers["x-role"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "ADMIN"; throw unauthorized(); }
function requireAdmin(request: FastifyRequest, action = false) { const role = actorRole(request); if (action ? role !== "ADMIN" : !["ADMIN", "SUPPORT"].includes(role)) throw forbidden(); const actor = request.headers["x-actor-id"]; return typeof actor === "string" ? actor : role === "ADMIN" ? "admin-demo" : "support-demo"; }

export function registerProviderRoutes(app: FastifyInstance) {
  app.get("/api/v1/provider/profile", async (request) => ({ data: await providerRepository.getProfile(providerId(request)) }));
  app.patch("/api/v1/provider/profile", async (request) => { const id = providerId(request); const input = parse(profileSchema, request.body); const current = await providerRepository.getProfile(id); canEditProfile(current, request.body as Record<string, unknown>); return { data: await providerRepository.updateProfile(id, input) }; });
  app.get("/api/v1/provider/services", async (request) => ({ data: await providerRepository.listServices(providerId(request)) }));
  app.put("/api/v1/provider/services", async (request) => { const id = providerId(request); const input = parse(serviceSchema, request.body); if (input.serviceSlugs.some((slug) => !seededCategories.some((category) => category.slug === slug && category.active))) throw new AppError("INVALID_SERVICE", "Choose an active service category.", 400); return { data: await providerRepository.setServices(id, input.serviceSlugs) }; });
  app.get("/api/v1/provider/availability", async (request) => ({ data: await providerRepository.listAvailability(providerId(request)) }));
  app.post("/api/v1/provider/availability", async (request, reply) => { const id = providerId(request); const parsed = parse(availabilitySchema, request.body); const input: AvailabilityInput = { ...parsed, active: parsed.active ?? true }; validateAvailability(input); return reply.code(201).send({ data: await providerRepository.createAvailability(id, input) }); });
  app.patch<{ Params: { id: string } }>("/api/v1/provider/availability/:id", async (request) => { const id = providerId(request); const input = parse(availabilitySchema.partial(), request.body); const current = (await providerRepository.listAvailability(id)).find((item) => item.id === request.params.id); if (!current) throw new AppError("NOT_FOUND", "Availability block not found.", 404); validateAvailability({ ...current, ...input, active: input.active ?? current.active } as AvailabilityInput); return { data: await providerRepository.updateAvailability(id, request.params.id, input) }; });
  app.delete<{ Params: { id: string } }>("/api/v1/provider/availability/:id", async (request, reply) => { await providerRepository.deleteAvailability(providerId(request), request.params.id); return reply.code(204).send(); });
  app.get("/api/v1/provider/verification", async (request) => ({ data: await providerRepository.getVerification(providerId(request)) }));
  app.post("/api/v1/provider/verification/submit", async (request) => ({ data: await providerRepository.submitForReview(providerId(request), providerId(request)) }));
  app.get("/api/v1/provider/documents", async (request) => ({ data: (await providerRepository.listDocuments(providerId(request))).map(({ id, documentType, status, uploadedAt }) => ({ id, documentType, status, uploadedAt })) }));
  app.post("/api/v1/provider/documents", async (request, reply) => { const id = providerId(request); const input = parse(documentSchema, request.body); const document = await providerRepository.submitDocument(id, input.documentType, input.storageRef); const { storageRef: _privateStorageRef, ...safeDocument } = document; return reply.code(201).send({ data: safeDocument }); });
  app.get("/api/v1/provider/requests", async () => ({ data: [], meta: { phase: "reserved-for-matching" } }));

  app.get("/api/v1/admin/providers", async (request) => ({ data: await providerRepository.listProviders(), meta: { role: requireAdmin(request) } }));
  app.get<{ Params: { id: string } }>("/api/v1/admin/providers/:id", async (request) => { requireAdmin(request); const id = request.params.id; const documents = (await providerRepository.listDocuments(id)).map(({ storageRef: _privateStorageRef, ...metadata }) => metadata); return { data: { profile: await providerRepository.getProviderForAdmin(id), verification: await providerRepository.getVerification(id), documents, services: await providerRepository.listServices(id) } }; });
  app.post<{ Params: { id: string } }>("/api/v1/admin/providers/:id/approve", async (request) => ({ data: await providerRepository.approve(request.params.id, requireAdmin(request, true)) }));
  app.post<{ Params: { id: string } }>("/api/v1/admin/providers/:id/reject", async (request) => { const input = parse(reasonSchema, request.body); return { data: await providerRepository.reject(request.params.id, requireAdmin(request, true), input.reason) }; });
  app.post<{ Params: { id: string } }>("/api/v1/admin/providers/:id/suspend", async (request) => { const input = parse(reasonSchema, request.body); return { data: await providerRepository.suspend(request.params.id, requireAdmin(request, true), input.reason) }; });
  app.get<{ Params: { id: string } }>("/api/v1/providers/:id/public", async (request) => ({ data: await providerRepository.getPublicProfile(request.params.id) }));
}
