# Technical Architecture

## Proposed stack

- Monorepo: npm workspaces with `apps/web`, `apps/api`, and shared packages. npm is used initially because it is available in the development environment; the workspace layout is package-manager agnostic.
- Language: TypeScript strict mode.
- Web: Next.js App Router, accessible React components, centralized CSS/design tokens.
- API: Fastify with REST `/api/v1` routes, Zod validation, structured errors, request IDs.
- Database: PostgreSQL with Prisma migrations and generated types.
- Jobs/cache: Redis-compatible adapter, introduced when notifications or scheduled work need it.
- Testing: Vitest for unit/integration tests and Playwright for critical browser journeys.
- Observability: structured logs, health/readiness endpoints, error reporting adapter, audit events.

## Boundaries

Domain modules own business rules: auth, users, services, bookings, matching, payments, notifications, locations, safety, support, and admin. Adapters isolate Razorpay, storage, maps, messaging, email, and verification providers. The UI never decides authorization or booking transitions.

## Runtime shape

Web calls the versioned API. API services validate input, authorize the actor, execute a domain command in a transaction, persist an audit/event record, and enqueue notifications where appropriate. A worker later handles retryable jobs. Provider location is accepted only for an active authorized service session.

## Delivery

Local Docker Compose will provide PostgreSQL and Redis. CI will run formatting, lint, typecheck, unit/integration tests, build, and dependency/security checks. Production deployment is intentionally deferred until the application baseline is stable.
