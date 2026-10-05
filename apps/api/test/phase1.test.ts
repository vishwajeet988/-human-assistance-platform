import assert from "node:assert/strict";
import test from "node:test";
import { canTransition } from "../src/bookings/state.js";
import { canAccessResource, hasAnyRole } from "../src/auth/rbac.js";
import { buildServer } from "../src/server.js";
import { parseConfig } from "../src/config.js";

test("booking state machine permits only defined transitions", () => {
  assert.equal(canTransition("DRAFT", "PENDING_PAYMENT"), true);
  assert.equal(canTransition("DRAFT", "SERVICE_STARTED"), false);
  assert.equal(canTransition("SERVICE_COMPLETED", "PAYMENT_SETTLED"), true);
});

test("RBAC distinguishes role access from resource ownership", () => {
  const customer = { id: "customer-1", roles: ["CUSTOMER"] as const };
  const admin = { id: "admin-1", roles: ["ADMIN"] as const };
  assert.equal(hasAnyRole(customer, ["CUSTOMER"]), true);
  assert.equal(canAccessResource(customer, "customer-2"), false);
  assert.equal(canAccessResource(admin, "customer-2"), true);
});

test("versioned health and readiness endpoints return the stable envelope", async () => {
  const app = buildServer();
  const health = await app.inject({ method: "GET", url: "/api/v1/health" });
  const ready = await app.inject({ method: "GET", url: "/api/v1/ready" });

  assert.equal(health.statusCode, 200);
  assert.deepEqual(health.json(), { data: { status: "ok" } });
  assert.equal(ready.statusCode, 200);
  assert.deepEqual(ready.json(), { data: { status: "ready", database: "not-configured" } });
  await app.close();
});

test("production configuration rejects the development JWT secret", () => {
  assert.throws(
    () => parseConfig({ NODE_ENV: "production", PORT: "4000" }),
    /JWT_SECRET must be explicitly configured in production/
  );
  assert.equal(parseConfig({ NODE_ENV: "production", PORT: "4000", JWT_SECRET: "a-secure-production-secret" }).NODE_ENV, "production");
});
