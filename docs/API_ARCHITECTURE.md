# API Architecture

Phase 3 routes are versioned under `/api/v1` and return `{ data }` on success or `{ error: { code, message } }` on failure.

## Catalog

- `GET /services`
- `GET /services/:slug`

## Customer-owned data

- `GET|POST /customer/family-members`
- `PATCH|DELETE /customer/family-members/:id`
- `GET|POST /customer/addresses`
- `PATCH|DELETE /customer/addresses/:id`

## Bookings

- `POST /bookings/estimate`
- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `POST /bookings/:id/cancel`

All customer resources are ownership-scoped. Booking creation validates active catalog data, timezone-aware future scheduling, configured duration, customer-owned family member/address, and server-side price. `Idempotency-Key` prevents duplicate creation for the same customer request.

The current development adapter uses an in-memory store behind the same domain contracts while PostgreSQL access wiring is completed. The SQL migration and seed files are the persistence contract; production mode does not accept the development customer identity fallback.
