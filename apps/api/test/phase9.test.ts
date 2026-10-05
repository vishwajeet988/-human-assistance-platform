import assert from "node:assert/strict";
import test from "node:test";
import { buildServer } from "../src/server.js";
test("operations metrics are protected and use current records", async () => { const app = buildServer(); const forbidden = await app.inject({ method: "GET", url: "/api/v1/admin/overview", headers: { "x-role": "CUSTOMER" } }); const allowed = await app.inject({ method: "GET", url: "/api/v1/admin/overview", headers: { "x-role": "SUPPORT" } }); assert.equal(forbidden.statusCode, 403); assert.equal(allowed.statusCode, 200); assert.equal(typeof allowed.json().data.bookings, "number"); assert.equal(typeof allowed.json().data.revenueMinor, "number"); await app.close(); });
