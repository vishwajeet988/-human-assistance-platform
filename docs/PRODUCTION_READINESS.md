# Production readiness

## Status: NOT LAUNCH READY

The product flows and security boundaries are implemented through Phase 9, but the default runtime remains development-memory. Do not process real customer payments or location data until the external adapters below are configured and the PostgreSQL transaction path is activated.

### Checklist

- [x] production configuration rejects development JWT/webhook secrets
- [x] production configuration requires PostgreSQL persistence mode and database URL
- [x] migrations are versioned through `008_operations_indexes.sql`
- [x] payment verification and webhook idempotency boundaries exist
- [x] notification, storage and map adapters are explicit
- [x] customer/provider/admin ownership and role tests exist
- [x] no private documents or credentials are committed
- [ ] wire a production PostgreSQL client and transactional booking assignment
- [ ] configure Razorpay sandbox, then production credentials and webhook secret
- [ ] configure private object storage and document scanning/retention
- [ ] configure email/SMS/push providers and delivery monitoring
- [ ] configure a map/location provider and retention controls
- [ ] add production session/auth integration and rate limiting at the edge
- [ ] run end-to-end tests against isolated PostgreSQL and real sandbox adapters
- [ ] perform dependency, load, backup/restore and incident-response reviews

## Deployment notes

Run migrations in order, never run development seed data in production, set `PERSISTENCE_MODE=postgres`, and use a secret manager for all credentials. Configure CORS to the deployed web origin, terminate TLS at the edge, redact request bodies and payment/location payloads from logs, and retain only the minimum location history required by policy.

## External configuration

Required before launch: PostgreSQL, payment gateway credentials/webhook secret, private document storage, notification providers, map provider if tracking is enabled, session/auth provider, monitoring and backups. The repository currently reports these as explicit limitations rather than pretending they are active.
