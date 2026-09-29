# API Plan

Base path: `/api/v1`. Responses use `{ data, meta, error }`; paginated collections include cursor/limit metadata. Errors expose a stable code and safe message, never secrets or private document details.

## Resource groups

- `/auth`: request/verify OTP, login/session refresh, logout.
- `/users`, `/dependents`, `/addresses`, `/emergency-contacts`.
- `/services`: categories, service details, availability/pricing estimates.
- `/providers`: onboarding, profile, documents, availability, requests, earnings.
- `/bookings`: create, quote, pay, list, detail, cancel, reschedule, timeline, review.
- `/matching`: internal candidate scoring and assignment commands.
- `/payments`: payment intent, webhook, refunds, invoices.
- `/notifications`: list/read preferences.
- `/locations`: session start/stop, authorized location updates, customer tracking view.
- `/incidents`, `/support`.
- `/admin`: users, verification, bookings, payments, incidents, analytics.

All protected routes use server-side authentication and role/resource authorization. List endpoints paginate and filter. Webhooks verify provider signatures and are idempotent.

