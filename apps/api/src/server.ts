import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "./config.js";
import { AppError } from "./errors.js";

export function buildServer() {
  const app = Fastify({ logger: { level: config.NODE_ENV === "development" ? "info" : "warn" } });
  app.register(helmet);
  app.register(cors, { origin: false });

  app.get("/health", async () => ({ data: { status: "ok" } }));
  app.get("/ready", async (_request, reply) => reply.send({ data: { status: "ready", database: "not-configured" } }));
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message } });
    app.log.error(error);
    return reply.code(500).send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
  });
  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = buildServer();
  app.listen({ host: "0.0.0.0", port: config.PORT }).catch((error) => { app.log.error(error); process.exit(1); });
}
