# Database Design

## Core entities

`users`, `roles`, `user_roles`, `otp_challenges`, `sessions`, `service_categories`, `services`, `family_members`, `customer_addresses`, `provider_profiles`, `provider_services`, `provider_service_areas`, `provider_availability`, `provider_documents`, `provider_verifications`, `provider_requests`, `provider_audit_events`, `bookings`, `booking_events`, `payments`, `refunds`, `provider_earnings`, `reviews`, `notifications`, `incidents`, `support_tickets`, and `audit_logs`.

## Rules

- UUID primary keys, UTC timestamps, created/updated timestamps, and soft deletion where appropriate.
- Foreign keys and database-level uniqueness for identity, assignment, and payment references.
- Enumerated status values are mirrored in domain code and validated at the API boundary.
- Index booking status/customer/provider/date, provider verification/status, notification recipient/read state, and audit subject/time.
- Sensitive document metadata is stored separately from private file content; files use private storage and signed, expiring URLs.
- Location points are scoped to a booking/session and have retention rules; no passive tracking outside a service session.
- Customer family members and addresses are scoped by `customer_id`; booking APIs verify ownership before reading or mutating either resource.
- Service pricing and duration options are stored in service configuration; client-submitted totals are never authoritative.
- Provider trust state is separate from profile content; provider-owned writes cannot change approval, verification, suspension, rating, or earnings fields.
- Verification files use private storage references and metadata; no document file is exposed through a public URL.

## Booking event model

Every valid transition creates an immutable `booking_events` record containing actor, previous state, next state, reason, timestamp, and safe metadata. Administrative overrides require an audit record and reason.

## Migration policy

All schema changes use versioned migrations. Seed data is development-only, clearly labeled, deterministic, and never contains real personal information.

## Phase 3 booking decision

Booking creation stores a server-calculated estimate and enters `PENDING_PAYMENT`. Payment is not processed in Phase 3, so no payment success or refund is implied. Customer-visible `booking_events` record creation and cancellation.
## Phase 5 matching

`provider_requests` records controlled candidate invitations for a booking. Phase 5 adds sent/viewed/responded/expiry timestamps, decline reason, explainable score metadata and `CANCELLED` status. `matching_request_events` records request lifecycle events. `bookings.assigned_provider_id` records the winning provider and is indexed with the scheduled start for conflict checks. Production assignment must run in a transaction with a booking row lock; the current development adapter serializes assignment in the matching service.

## Phase 6 financials

`payments`, `payment_webhook_events`, `refunds`, `provider_earnings_ledger` and `financial_audit_events` keep gateway state, idempotency, refunds and commission records separate from booking estimates. Development uses sandbox records; no bank payout is represented.

## Phase 7 notifications

`notifications` stores recipient-scoped, channel-specific delivery records with an event/channel uniqueness key. Development adapters complete safely without sending external messages; configured providers can be added behind the same adapter interface.
