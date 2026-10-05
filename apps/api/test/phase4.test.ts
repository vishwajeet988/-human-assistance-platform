import assert from "node:assert/strict";
import test from "node:test";
import { buildServer } from "../src/server.js";
import { createProviderRepository, PostgresProviderRepository } from "../src/provider/repository.js";

test("provider profile and service selection are provider-scoped", async () => {
  const app = buildServer();
  const headers = { "x-provider-id": "provider-demo-incomplete" };
  const profile = await app.inject({ method: "GET", url: "/api/v1/provider/profile", headers });
  const update = await app.inject({ method: "PATCH", url: "/api/v1/provider/profile", headers, payload: { displayName: "Demo Companion", bio: "Development profile", experienceSummary: "Development experience", languages: ["English", "Hindi"] } });
  const services = await app.inject({ method: "PUT", url: "/api/v1/provider/services", headers, payload: { serviceSlugs: ["elder-companion"] } });
  const protectedUpdate = await app.inject({ method: "PATCH", url: "/api/v1/provider/profile", headers, payload: { onboardingStatus: "APPROVED" } });
  assert.equal(profile.json().data.onboardingStatus, "PROFILE_INCOMPLETE");
  assert.equal(update.statusCode, 200);
  assert.equal(update.json().data.onboardingStatus, "PROFILE_COMPLETED");
  assert.equal(services.statusCode, 200);
  assert.equal(services.json().data[0].eligibilityStatus, "PENDING");
  const submission = await app.inject({ method: "POST", url: "/api/v1/provider/verification/submit", headers });
  assert.equal(submission.json().data.onboardingStatus, "VERIFICATION_PENDING");
  assert.equal(protectedUpdate.statusCode, 403);
  await app.close();
});

test("availability rejects overlaps and invalid timezone", async () => {
  const app = buildServer();
  const headers = { "x-provider-id": "provider-demo-incomplete" };
  const first = await app.inject({ method: "POST", url: "/api/v1/provider/availability", headers, payload: { kind: "WEEKLY", dayOfWeek: 1, startTime: "09:00", endTime: "13:00", timezone: "Asia/Kolkata" } });
  const overlap = await app.inject({ method: "POST", url: "/api/v1/provider/availability", headers, payload: { kind: "WEEKLY", dayOfWeek: 1, startTime: "12:00", endTime: "16:00", timezone: "Asia/Kolkata" } });
  const invalid = await app.inject({ method: "POST", url: "/api/v1/provider/availability", headers, payload: { kind: "WEEKLY", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", timezone: "Mars/Colony" } });
  assert.equal(first.statusCode, 201);
  assert.equal(overlap.statusCode, 409);
  assert.equal(invalid.statusCode, 400);
  await app.close();
});

test("admin verification actions are role-protected and create truthful state changes", async () => {
  const app = buildServer();
  const adminHeaders = { "x-role": "ADMIN", "x-actor-id": "admin-1" };
  const support = await app.inject({ method: "POST", url: "/api/v1/admin/providers/provider-demo-incomplete/approve", headers: { "x-role": "SUPPORT", "x-actor-id": "support-1" } });
  const selfApprove = await app.inject({ method: "POST", url: "/api/v1/admin/providers/provider-demo-incomplete/approve", headers: { ...adminHeaders, "x-actor-id": "provider-demo-incomplete" } });
  const approved = await app.inject({ method: "POST", url: "/api/v1/admin/providers/provider-demo-incomplete/approve", headers: adminHeaders });
  const suspended = await app.inject({ method: "POST", url: "/api/v1/admin/providers/provider-demo-incomplete/suspend", headers: adminHeaders, payload: { reason: "Development suspension test" } });
  const publicProfile = await app.inject({ method: "GET", url: "/api/v1/providers/provider-demo-incomplete/public" });
  assert.equal(support.statusCode, 403);
  assert.equal(selfApprove.statusCode, 403);
  assert.equal(approved.json().data.onboardingStatus, "APPROVED");
  assert.equal(suspended.json().data.accountStatus, "SUSPENDED");
  assert.equal(publicProfile.json().data.profilePhotoRef, undefined);
  const suspendedAgain = await app.inject({ method: "POST", url: "/api/v1/admin/providers/provider-demo-incomplete/approve", headers: adminHeaders });
  assert.equal(suspendedAgain.statusCode, 409);
  await app.close();
});

test("document storage references are private and development-only", async () => {
  const app = buildServer();
  const response = await app.inject({ method: "POST", url: "/api/v1/provider/documents", headers: { "x-provider-id": "provider-demo-approved" }, payload: { documentType: "IDENTITY", storageRef: "private://provider-demo-approved/identity-1" } });
  const publicUrl = await app.inject({ method: "POST", url: "/api/v1/provider/documents", headers: { "x-provider-id": "provider-demo-approved" }, payload: { documentType: "IDENTITY", storageRef: "https://example.test/public.pdf" } });
  assert.equal(response.statusCode, 201);
  assert.equal(response.json().data.storageRef, undefined);
  assert.equal(publicUrl.statusCode, 400);
  await app.close();
});

test("provider repository has explicit memory and PostgreSQL wiring points", async () => {
  assert.throws(() => createProviderRepository({ mode: "postgres" }), /requires a SQL client/);
  const repository = createProviderRepository({ mode: "postgres", client: { query: async () => ({ rows: [{ userId: "provider-1", displayName: "SQL Provider", languages: [], timezone: "Asia\/Kolkata", onboardingStatus: "PROFILE_INCOMPLETE", accountStatus: "ACTIVE" }] }) } });
  assert.ok(repository instanceof PostgresProviderRepository);
  const profile = await repository.getProfile("provider-1");
  assert.equal(profile.displayName, "SQL Provider");
});
