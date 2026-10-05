import assert from "node:assert/strict";
import test from "node:test";
import { buildServer } from "../src/server.js";

const adminHeaders = { "x-role": "ADMIN", "x-actor-id": "ops-phase5" };
const providerHeaders = { "x-provider-id": "provider-demo-approved", "x-role": "PROVIDER" };

let bookingNumber = 0;
async function booking(app: ReturnType<typeof buildServer>) {
  const day = 4 + bookingNumber++ * 7;
  const address = await app.inject({ method: "POST", url: "/api/v1/customer/addresses", headers: { "x-customer-id": "customer-phase5" }, payload: { label: "Home", recipientName: "Asha Rao", addressLine1: "12 Lake View Road", locality: "Indiranagar", city: "Bengaluru", state: "Karnataka", postalCode: "560038" } });
  return app.inject({ method: "POST", url: "/api/v1/bookings", headers: { "x-customer-id": "customer-phase5", "idempotency-key": `phase5-${Math.random()}` }, payload: { serviceSlug: "elder-companion", addressId: address.json().data.id, scheduledStart: `2099-05-${String(day).padStart(2, "0")}T10:00:00+05:30`, durationMinutes: 120 } });
}

test("matching excludes ineligible providers and creates controlled requests", async () => {
  const app = buildServer(); const created = await booking(app); const retry = await app.inject({ method: "POST", url: `/api/v1/admin/bookings/${created.json().data.id}/retry-matching`, headers: adminHeaders });
  assert.equal(retry.statusCode, 200); assert.equal(retry.json().data.booking.state, "SEARCHING_PROVIDER"); assert.equal(retry.json().data.candidates, 1); assert.equal(retry.json().data.requests.length, 1); assert.equal(retry.json().data.requests[0].providerId, "provider-demo-approved"); await app.close();
});

test("provider request can be viewed, accepted once, and customer sees safe assignment", async () => {
  const app = buildServer(); const created = await booking(app); const retry = await app.inject({ method: "POST", url: `/api/v1/admin/bookings/${created.json().data.id}/retry-matching`, headers: adminHeaders }); const requestId = retry.json().data.requests[0].id;
  const viewed = await app.inject({ method: "POST", url: `/api/v1/provider/requests/${requestId}/view`, headers: providerHeaders }); assert.equal(viewed.statusCode, 200);
  const accepted = await app.inject({ method: "POST", url: `/api/v1/provider/requests/${requestId}/accept`, headers: providerHeaders }); assert.equal(accepted.statusCode, 200); assert.equal(accepted.json().data.booking.state, "PROVIDER_ASSIGNED");
  const second = await app.inject({ method: "POST", url: `/api/v1/provider/requests/${requestId}/accept`, headers: providerHeaders }); assert.equal(second.statusCode, 409);
  const assignment = await app.inject({ method: "GET", url: `/api/v1/customer/bookings/${created.json().data.id}/assignment`, headers: { "x-customer-id": "customer-phase5" } }); assert.equal(assignment.json().data.status, "ASSIGNED"); assert.equal(assignment.json().data.provider.displayName.includes("Demo Provider"), true); await app.close();
});

test("provider and admin authorization protect request operations", async () => {
  const app = buildServer(); const created = await booking(app); const retry = await app.inject({ method: "POST", url: `/api/v1/admin/bookings/${created.json().data.id}/retry-matching`, headers: adminHeaders }); const requestId = retry.json().data.requests[0].id;
  const other = await app.inject({ method: "GET", url: `/api/v1/provider/requests/${requestId}`, headers: { "x-provider-id": "provider-demo-suspended", "x-role": "PROVIDER" } }); assert.equal(other.statusCode, 404);
  const support = await app.inject({ method: "POST", url: `/api/v1/admin/bookings/${created.json().data.id}/assign-provider`, headers: { "x-role": "SUPPORT", "x-actor-id": "support-phase5" }, payload: { providerId: "provider-demo-approved" } }); assert.equal(support.statusCode, 403); await app.close();
});
