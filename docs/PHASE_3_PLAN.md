# Phase 3 Plan — Service Catalog & Customer Booking Experience

## Existing relevant architecture

- Fastify API in `apps/api` with versioned `/api/v1` health routes and a stable `{ data, error }` response shape.
- Next.js App Router web app in `apps/web` with Phase 2 tokens, UI primitives, and customer shell.
- PostgreSQL migration/seed directory in `db/`; Phase 1 contains users, roles, sessions, service categories, bookings, booking events, and audit logs.
- RBAC primitives and a server-owned booking state machine. No provider assignment or payment implementation exists.

## Phase 3 scope

- Database-driven service category/service model and four non-medical seeded service offerings.
- Customer family members/dependents and saved addresses with ownership boundaries.
- Server-side price estimates using configured duration options and rates.
- Customer booking creation into `PENDING_PAYMENT`, with initial customer-visible timeline event.
- Customer booking list/detail/cancellation API and customer marketplace UI routes.
- Mobile-friendly multi-step booking flow with review and estimated price summary.

## Database changes

Migration `002_customer_booking.sql` extends categories, adds services, family members, customer addresses, and booking details. It also adds idempotency and customer-visible event fields. Development seed data contains only system/demo catalog records and no personal or provider data.

## API changes

Versioned endpoints are added for services, family members, addresses, estimates, bookings, booking details, and cancellation. Zod schemas validate input; the domain service validates active catalog records, duration/date rules, ownership, server-side pricing, idempotency, and allowed cancellation transitions.

## Frontend routes

- `/customer/services`
- `/customer/services/[slug]`
- `/customer/bookings/new`
- `/customer/bookings`
- `/customer/bookings/[id]`

These routes reuse Phase 2 shell and UI components. They do not display fake provider assignments or payment success.

## Booking flow

The wizard collects recipient, service, address, date/time, duration, notes, emergency contact, and review confirmation. Creation returns a booking in `PENDING_PAYMENT`; payment is explicitly not processed in Phase 3.

## Validation rules

- Active services only; configured duration options only.
- Scheduled start must be in the future and use an explicit ISO timestamp with offset.
- Notes are limited to 1,000 characters and should not contain unnecessary sensitive information.
- Family members and addresses must belong to the authenticated customer.
- Customer booking reads, changes, and cancellation are ownership protected.

## Pricing architecture

Pricing is a domain service with an extension point for future modifiers. MVP pricing is `base price + hourly rate × additional hours`, calculated only on the server. The frontend displays an estimate and never submits an authoritative amount.

## Testing strategy

- Unit tests for catalog lookup, duration/date validation, price calculation, state/cancellation rules, and ownership checks.
- Fastify integration tests for service, customer data, estimate, booking, cancellation, and IDOR failures.
- Existing workspace test, typecheck, build, and diff checks.
- Manual responsive review of browsing, wizard, review, confirmation, list, and detail states.

## Definition of done

- Catalog and initial seed data exist outside frontend components.
- Customer can browse services, manage recipient/address data, estimate price, create a pre-payment booking, view its timeline, and cancel when eligible.
- No provider assignment, payment, tracking, subscriptions, or medical workflows are added.
- Ownership and server-side pricing tests pass; docs and changelog are updated; one clean commit is created.
