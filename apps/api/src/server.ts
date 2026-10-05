import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { registerCustomerRoutes } from "./customer/routes.js";
import { registerProviderRoutes } from "./provider/routes.js";
import { registerMatchingRoutes } from "./matching/routes.js";

export function buildServer() {
  const app = Fastify({ logger: { level: config.NODE_ENV === "development" ? "info" : "warn" } });
  app.register(helmet);
  app.register(cors, { origin: false });

  const health = async () => ({ data: { status: "ok" } });
  const ready = async (_request: unknown, reply: { send: (body: unknown) => unknown }) =>
    reply.send({ data: { status: "ready", database: "not-configured" } });
  app.get("/health", health);
  app.get("/ready", ready);
  app.get("/api/v1/health", health);
  app.get("/api/v1/ready", ready);
  registerCustomerRoutes(app);
  registerProviderRoutes(app);
  registerMatchingRoutes(app);
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message } });
    app.log.error(error);
    return reply.code(500).send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
  });
  return app;
}
