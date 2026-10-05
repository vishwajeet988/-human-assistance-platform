# Phase 4 Plan — Provider Onboarding, Trust & Availability

## Current architecture and limitation

Phase 3 provides Fastify routes, a PostgreSQL migration/seed contract, a customer domain store, RBAC primitives, and a server-owned booking state machine. Customer services and bookings currently use a development in-memory adapter; PostgreSQL access is not wired into the runtime.

Phase 4 introduces an explicit provider repository boundary. Domain services and route handlers depend on `ProviderRepository`, with an in-memory implementation for deterministic tests/development and a SQL-client-backed PostgreSQL implementation contract for production wiring. The API will not claim PostgreSQL persistence is active unless a repository is configured.

## Scope

- Provider profile and onboarding lifecycle.
- Service-category selection and eligibility flags.
- Structured service areas and timezone-aware weekly availability/blackout blocks.
- Verification records, secure document metadata, and storage abstraction.
- Admin/support-separated verification review with audit events.
- Customer-safe provider profile projection and unused provider-request foundation.
- Provider dashboard pages for profile, services, availability, and verification.
- Admin provider review pages and actions.

No automatic matching, booking acceptance, payments, GPS, notifications, or regulated medical workflows are implemented.

## Provider lifecycle

`REGISTERED → PROFILE_INCOMPLETE → PROFILE_COMPLETED → VERIFICATION_PENDING → VERIFICATION_REVIEW → APPROVED`, with `REJECTED`, `SUSPENDED`, and `DEACTIVATED` exception states. Only `APPROVED` and active providers with eligible service categories are considered eligible for future assignment.

## Verification lifecycle

Identity, address, background screening, and training are separate records with `NOT_STARTED`, `PENDING`, `IN_REVIEW`, `VERIFIED`, `FAILED`, or `EXPIRED` states. Development adapters are visibly marked as development-only and never imply real verification.

## Availability model

Weekly availability uses ISO day-of-week, local start/end times, IANA timezone, and active status. Blackout blocks use timezone-aware start/end timestamps. The repository rejects invalid ranges and overlapping records for the same provider.

## APIs

Provider routes cover profile, services, availability, verification, document metadata, and request foundation. Admin routes list/detail providers and approve, reject, or suspend them. All are versioned under `/api/v1`, validated with Zod, and protected by provider ownership or admin/support checks.

## Database changes

Migration `003_provider_trust.sql` extends provider profiles and adds provider services, service areas, availability, documents, verification records, requests, and provider audit events with foreign keys, status checks, and indexes. Development seed rows are explicitly labeled demo data.

## Security model

Providers can edit only their own profile/services/availability and cannot edit trust states, documents’ review state, ratings, or administrative fields. Support can inspect but cannot approve/suspend. Customers receive only a safe public profile projection. Private documents are metadata-only and use a storage reference; files are never public.

## Testing strategy

Unit tests cover lifecycle transitions and overlap/eligibility rules. Fastify integration tests cover provider ownership, profile/services/availability updates, document submission, admin approval/rejection/suspension, support restrictions, private-data boundaries, and repository behavior through the in-memory adapter. Typecheck, build, and diff checks remain required.

## Definition of done

Provider onboarding, verification, service eligibility, availability, document architecture, admin review, audit events, safe profile projection, repository separation, responsive provider/admin surfaces, documentation, tests, and one clean commit are complete. Phase 5 matching is not started.
