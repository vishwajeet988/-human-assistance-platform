# Current State

## Repository assessment

- Repository: `human-assistance-platform`
- Location: Desktop workspace
- Git: initialized, current branch `feature/platform-mvp`
- Project type: TypeScript npm workspace monorepo

## Existing technology

The Phase 1 workspace, API/web boundaries, runtime configuration, initial PostgreSQL migration with OTP/session tables, API health/readiness routes, RBAC/booking domain primitives, test harness, and local Docker services are in place. Authentication route wiring, persistence access, customer/provider workflows, and deployment remain incomplete.

## Existing product functionality

The web app is a foundation landing screen. The API exposes health/readiness checks and no business resource routes yet.

## Implication

The project can now proceed from foundation into authentication and customer-core work. External integrations remain adapter-based and explicitly sandboxed or mocked in development.

Phase 3 adds the customer catalog and booking experience. The web app now includes customer service browsing, a multi-step booking request, customer-owned people and places, booking history, booking detail, and cancellation. The API uses a development in-memory adapter matching the SQL contract; PostgreSQL repository wiring, provider workflows, payments, tracking, and deployment remain future work.

Phase 4 adds provider onboarding, trust/verification metadata, availability, admin review, provider audit events, document storage contracts, and provider-safe public profiles. The provider repository is separated behind an interface with both memory and SQL-backed implementations; the runtime still selects memory explicitly until a PostgreSQL driver/client is configured.
