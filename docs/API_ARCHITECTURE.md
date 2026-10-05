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

## Provider and operations

- `GET|PATCH /provider/profile`
- `GET|PUT /provider/services`
- `GET|POST /provider/availability`
- `PATCH|DELETE /provider/availability/:id`
- `GET /provider/verification`
- `POST /provider/verification/submit`
- `GET|POST /provider/documents`
- `GET /provider/requests` (controlled development matching requests)
- `GET /provider/requests/:id`
- `POST /provider/requests/:id/view|accept|decline`
- `GET /customer/bookings/:id/assignment`
- `GET /admin/matching/bookings` and `/admin/matching/bookings/:id`
- `POST /admin/bookings/:id/retry-matching|assign-provider|cancel-requests`
- `POST /bookings/:id/payment`, `POST /payments/:id/verify|refund`, `POST /payments/webhook`
- `GET /admin/payments`, `GET /admin/earnings`
- `GET /admin/providers`
- `GET /admin/providers/:id`
- `POST /admin/providers/:id/approve`
- `POST /admin/providers/:id/reject`
- `POST /admin/providers/:id/suspend`
- `GET /providers/:id/public`

Provider persistence is behind `ProviderRepository`. `InMemoryProviderRepository` is used explicitly by the current development runtime and tests. `PostgresProviderRepository` accepts a parameterized `SqlExecutor`; `createProviderRepository({ mode: "postgres", client })` is the production wiring point. Document files use the `DocumentStorage` abstraction and only private storage references are accepted.
