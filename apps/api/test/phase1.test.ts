import assert from "node:assert/strict";
import test from "node:test";
import { canTransition } from "../src/bookings/state.js";
import { canAccessResource, hasAnyRole } from "../src/auth/rbac.js";

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
