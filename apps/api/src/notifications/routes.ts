import type { FastifyInstance, FastifyRequest } from "fastify";
import { config } from "../config.js";
import { unauthorized } from "../errors.js";
import { notificationService } from "./service.js";
function customerId(request: FastifyRequest) { const value = request.headers["x-customer-id"]; if (typeof value === "string" && value) return value; if (config.NODE_ENV !== "production") return "customer-demo"; throw unauthorized(); }
export function registerNotificationRoutes(app: FastifyInstance) { app.get("/api/v1/customer/notifications", async (request) => ({ data: notificationService.list(customerId(request)) })); app.post<{ Params: { id: string } }>("/api/v1/customer/notifications/:id/read", async (request) => ({ data: notificationService.markRead(customerId(request), request.params.id) })); }
