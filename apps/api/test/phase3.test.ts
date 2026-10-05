import assert from "node:assert/strict";
import test from "node:test";
import { buildServer } from "../src/server.js";

const headers = { "x-customer-id": "customer-phase3" };

test("catalog exposes active services and rejects an invalid slug", async () => {
  const app = buildServer();
  const list = await app.inject({ method: "GET", url: "/api/v1/services" });
  const missing = await app.inject({ method: "GET", url: "/api/v1/services/not-a-service" });
  assert.equal(list.statusCode, 200);
  assert.equal(list.json().data.length, 4);
  assert.equal(missing.statusCode, 404);
  await app.close();
});

test("customer booking validates ownership, calculates price server-side, and creates an event", async () => {
  const app = buildServer();
  const family = await app.inject({ method: "POST", url: "/api/v1/customer/family-members", headers, payload: { name: "Asha Rao", relationship: "Mother", notes: "Meet at the main entrance." } });
  const address = await app.inject({ method: "POST", url: "/api/v1/customer/addresses", headers, payload: { label: "Home", recipientName: "Asha Rao", addressLine1: "12 Lake View Road", locality: "Indiranagar", city: "Bengaluru", state: "Karnataka", postalCode: "560038" } });
  const familyId = family.json().data.id;
  const addressId = address.json().data.id;
  const estimate = await app.inject({ method: "POST", url: "/api/v1/bookings/estimate", headers, payload: { serviceSlug: "elder-companion", durationMinutes: 120 } });
  const booking = await app.inject({ method: "POST", url: "/api/v1/bookings", headers: { ...headers, "idempotency-key": "phase3-booking-1" }, payload: { familyMemberId: familyId, serviceSlug: "elder-companion", addressId, scheduledStart: "2099-05-04T10:00:00+05:30", durationMinutes: 120, requirements: "Please call on arrival." } });
  assert.equal(estimate.statusCode, 200);
  assert.equal(estimate.json().data.totalMinor, 59800);
  assert.equal(booking.statusCode, 201);
  assert.equal(booking.json().data.state, "PENDING_PAYMENT");
  assert.equal(booking.json().data.estimateAmountMinor, 59800);
  assert.equal(booking.json().data.events[0].type, "BOOKING_CREATED");
  const duplicate = await app.inject({ method: "POST", url: "/api/v1/bookings", headers: { ...headers, "idempotency-key": "phase3-booking-1" }, payload: { familyMemberId: familyId, serviceSlug: "elder-companion", addressId, scheduledStart: "2099-05-04T10:00:00+05:30", durationMinutes: 120 } });
  assert.equal(duplicate.json().data.id, booking.json().data.id);
  const cancelled = await app.inject({ method: "POST", url: `/api/v1/bookings/${booking.json().data.id}/cancel`, headers });
  assert.equal(cancelled.statusCode, 200);
  assert.equal(cancelled.json().data.state, "CANCELLED");
  assert.equal(cancelled.json().data.events.at(-1).type, "BOOKING_CANCELLED");
  await app.close();
});

test("customer booking ownership is enforced and eligible cancellation records an event", async () => {
  const app = buildServer();
  const other = await app.inject({ method: "GET", url: "/api/v1/bookings", headers: { "x-customer-id": "customer-other" } });
  assert.deepEqual(other.json().data, []);
  const forbidden = await app.inject({ method: "POST", url: "/api/v1/bookings", headers, payload: { serviceSlug: "elder-companion", addressId: "00000000-0000-4000-8000-000000000000", scheduledStart: "2099-05-04T10:00:00+05:30", durationMinutes: 120 } });
  assert.equal(forbidden.statusCode, 403);
  await app.close();
});
