# Security and Privacy Plan

- Passwords, if enabled, use a modern password hash; sessions use secure, httpOnly, same-site cookies or short-lived tokens with refresh rotation.
- OTP, login, webhook, upload, and sensitive operations are rate-limited and audited.
- Zod/schema validation, authorization middleware, output filtering, safe error responses, and parameterized ORM queries are mandatory.
- Roles are enforced server-side: `CUSTOMER`, `PROVIDER`, `ADMIN`, and optional `SUPPORT`; resource ownership is checked separately.
- Identity documents, emergency contacts, location, family information, and payment references are private, encrypted in transit, access logged, and retained only as needed.
- Private files use content-type/size validation, malware scanning adapter hooks, private buckets, and expiring signed URLs.
- Location sharing is opt-in, booking-scoped, time-bounded, and disabled at completion/cancellation.
- Emergency actions create immutable audit records, notify configured operations/emergency contacts, and clearly state platform limitations.
- Secrets come only from environment variables. `.env*` is ignored except `.env.example`. Run secret scanning before commits/releases.

