# Security Architecture — Provider Trust

Provider APIs resolve provider identity from the authenticated session in production. The current development adapter permits explicit `x-provider-id`, `x-role`, and `x-actor-id` headers only in non-production mode so tests can exercise ownership and role boundaries without pretending a real session exists.

Provider-owned profile, service, availability, verification, and document metadata routes are scoped to that provider. Administrative actions require `ADMIN`; `SUPPORT` may inspect provider records but cannot approve, reject, or suspend. Providers cannot approve themselves.

Verification states are factual workflow states, not proof of external checks. Development verification records are marked development-only. Document submissions accept private storage references only; public URLs are rejected and document listing omits storage references.

Approval, rejection, suspension, and document submission create provider audit events. Customer-facing provider profiles expose only a safe projection: display name, public bio, languages, experience summary, approved service eligibility, service areas, and defined verification labels. Private documents, internal notes, addresses, and contact details are excluded.

Availability validates IANA timezone, weekly day/time ranges, blackout ranges, and overlap. It provides data for future matching but does not assign providers or accept bookings in Phase 4.
