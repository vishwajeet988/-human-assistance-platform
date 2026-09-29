# Database Design

## Core entities

`users`, `roles`, `user_roles`, `customer_profiles`, `provider_profiles`, `dependents`, `addresses`, `emergency_contacts`, `service_categories`, `provider_services`, `provider_areas`, `provider_availability`, `provider_documents`, `verification_records`, `bookings`, `booking_events`, `booking_requirements`, `location_sessions`, `location_points`, `payments`, `refunds`, `provider_earnings`, `reviews`, `notifications`, `incidents`, `support_tickets`, and `audit_logs`.

## Rules

- UUID primary keys, UTC timestamps, created/updated timestamps, and soft deletion where appropriate.
- Foreign keys and database-level uniqueness for identity, assignment, and payment references.
- Enumerated status values are mirrored in domain code and validated at the API boundary.
- Index booking status/customer/provider/date, provider verification/status, notification recipient/read state, and audit subject/time.
- Sensitive document metadata is stored separately from private file content; files use private storage and signed, expiring URLs.
- Location points are scoped to a booking/session and have retention rules; no passive tracking outside a service session.

## Booking event model

Every valid transition creates an immutable `booking_events` record containing actor, previous state, next state, reason, timestamp, and safe metadata. Administrative overrides require an audit record and reason.

## Migration policy

All schema changes use versioned migrations. Seed data is development-only, clearly labeled, deterministic, and never contains real personal information.

