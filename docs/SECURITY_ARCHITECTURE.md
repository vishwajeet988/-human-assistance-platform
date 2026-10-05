# Security Architecture — Provider Trust

Provider APIs resolve provider identity from the authenticated session in production. The current development adapter permits explicit `x-provider-id`, `x-role`, and `x-actor-id` headers only in non-production mode so tests can exercise ownership and role boundaries without pretending a real session exists.

Provider-owned profile, service, availability, verification, and document metadata routes are scoped to that provider. Administrative actions require `ADMIN`; `SUPPORT` may inspect provider records but cannot approve, reject, or suspend. Providers cannot approve themselves.

Verification states are factual workflow states, not proof of external checks. Development verification records are marked development-only. Document submissions accept private storage references only; public URLs are rejected and document listing omits storage references.

Approval, rejection, suspension, and document submission create provider audit events. Customer-facing provider profiles expose only a safe projection: display name, public bio, languages, experience summary, approved service eligibility, service areas, and defined verification labels. Private documents, internal notes, addresses, and contact details are excluded.

Availability validates IANA timezone, weekly day/time ranges, blackout ranges, and overlap. It provides data for future matching but does not assign providers or accept bookings in Phase 4.
## Phase 5 matching controls

Provider requests are scoped by provider ownership. Acceptance rechecks approval, active account, service eligibility, availability, blackout periods and assigned-booking conflicts. Assignment is serialized in development and must use a PostgreSQL transaction/row lock when the SQL client is wired. Customer assignment responses expose only the customer-safe provider projection; matching scores, private documents and other candidates remain internal. Admin manual assignment requires the admin role and creates an audit event.

Payment verification is server-side HMAC/gateway-adapter validation. Payment creation uses idempotency keys, webhook event IDs are deduplicated, and financial endpoints enforce customer ownership or admin/support roles. Secrets are configuration-only and no payment credentials are committed.

Location endpoints require an assigned provider or owning customer. Coordinates are not available to arbitrary users and sharing requires an active provider tracking session. Emergency reporting is limited to booking participants; the platform records an operations incident but does not present itself as emergency medical infrastructure.

Operations metrics and customer/booking lists require admin or support roles. Mutating actions remain separately restricted to admin where they change trust, assignment or incident state.
