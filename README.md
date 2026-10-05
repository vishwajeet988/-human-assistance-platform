# Human Assistance Platform

Premium, trustworthy non-medical human assistance for when family or friends cannot be there.

## Status

Phase 0 discovery and the initial Phase 1 foundation are complete. The repository contains a runnable API/web workspace, database migration foundation, health checks, domain primitives, and local PostgreSQL/Redis composition. Customer/provider workflows are not implemented yet.

See [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md), [docs/PRODUCT_PLAN.md](docs/PRODUCT_PLAN.md), and [docs/ROADMAP.md](docs/ROADMAP.md) for the project baseline and plan.

## Local checks

```bash
npm install
npm test
npm run typecheck
npm run build
```

Start local infrastructure with `docker compose up -d` when database-backed work begins.

Phase 3 customer routes include `/customer/services`, `/customer/services/[slug]`, `/customer/bookings/new`, `/customer/bookings`, `/customer/bookings/[id]`, and `/app/people`. Payment, provider assignment, and live tracking are intentionally out of scope.
