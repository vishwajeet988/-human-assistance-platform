# Human Assistance Platform

Premium, trustworthy non-medical human assistance for when family or friends cannot be there.

## Status

Phases 1–9 are implemented as a development-ready marketplace foundation. Production launch remains gated by the explicit checklist in [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

See [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md), [docs/PRODUCT_PLAN.md](docs/PRODUCT_PLAN.md), and [docs/ROADMAP.md](docs/ROADMAP.md) for the project baseline and plan.

## Local checks

```bash
npm install
npm test
npm run typecheck
npm run build
```

Start local infrastructure with `docker compose up -d` when database-backed work begins.

Phase 3 established `/customer/services`, `/customer/services/[slug]`, `/customer/bookings/new`, `/customer/bookings`, `/customer/bookings/[id]`, and `/app/people`.

Phase 4 established `/provider/profile`, `/provider/availability`, `/provider/verification`, and `/admin/providers`, including provider approval, eligibility and availability foundations.
### Phase 5

Provider matching is now available as a development foundation. Approved eligible providers receive bounded requests based on service, structured service area, availability and booking conflict checks. Payment capture, notifications and live tracking remain intentionally unimplemented.

Phase 6 adds a sandbox financial workflow with server-side payment verification, webhook idempotency and refund/earnings foundations. Configure gateway credentials before production use; no provider payouts are implemented.

Phase 7 adds a customer family space and deduplicated notification foundation. External message delivery remains disabled until providers are configured.

Phase 8 adds safety/location foundations for assigned active services. It is not an ambulance or emergency medical service and live map integrations remain configurable future infrastructure.

Phase 9 adds operations summaries and live-derived marketplace metrics with admin/support access controls.

Phase 10 adds production configuration validation, deployment/environment guidance and a final readiness checklist. The default runtime remains development-memory until PostgreSQL and external providers are explicitly configured.
