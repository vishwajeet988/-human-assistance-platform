import type { FastifyInstance, FastifyRequest } from "fastify";
import { config } from "../config.js";
import { forbidden, unauthorized } from "../errors.js";
import { operationsService } from "./service.js";
function requireOps(request: FastifyRequest) { const role = request.headers["x-role"]; if (typeof role === "string" && !["ADMIN", "SUPPORT"].includes(role)) throw forbidden(); if (config.NODE_ENV === "production" && !role) throw unauthorized(); }
export function registerOperationsRoutes(app: FastifyInstance) { app.get("/api/v1/admin/overview", async (request) => { requireOps(request); return { data: await operationsService.overview() }; }); app.get("/api/v1/admin/customers", async (request) => { requireOps(request); return { data: operationsService.customers() }; }); app.get("/api/v1/admin/bookings", async (request) => { requireOps(request); return { data: operationsService.bookings() }; }); }
