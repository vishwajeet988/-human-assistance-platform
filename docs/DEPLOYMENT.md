# Deployment guide

1. Provision PostgreSQL and apply `db/migrations/*.sql` in filename order.
2. Set `NODE_ENV=production`, a strong `JWT_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `DATABASE_URL`, and `PERSISTENCE_MODE=postgres`.
3. Configure private storage, notification and map adapters only when their credentials and retention policies are approved.
4. Run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` in CI.
5. Start API and web behind TLS, restrict CORS to the web origin, and expose only health/readiness endpoints publicly.
6. Verify payment webhook signatures, database backups, alerting and rollback procedures before pilot traffic.

Production seed data is intentionally separate from development seed data and must not be executed.
