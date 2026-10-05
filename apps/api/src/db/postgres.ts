import { Pool } from "pg";
import { config } from "../config.js";

/** Shared SQL client for production repositories. Tests keep using injected fakes. */
export const postgresPool = config.PERSISTENCE_MODE === "postgres" && config.DATABASE_URL
  ? new Pool({ connectionString: config.DATABASE_URL, max: 10, idleTimeoutMillis: 30_000 })
  : undefined;

export async function closePostgresPool() {
  if (postgresPool) await postgresPool.end();
}
