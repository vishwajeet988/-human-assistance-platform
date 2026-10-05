# UI/UX System — Phase 3

Phase 3 extends the Phase 2 system without introducing a new visual language.

## Customer routes

- `/customer/services`: scannable catalog with starting estimate, duration choices, trust notes, and clear CTAs.
- `/customer/services/[slug]`: included/not-included scope, requirements, duration, estimate, and booking CTA.
- `/customer/bookings/new`: six-step mobile-friendly wizard covering recipient, service, address, time, details, and review.
- `/customer/bookings`: upcoming/request history list.
- `/customer/bookings/[id]`: estimate, timeline, requirements, state, and eligible cancellation.
- `/app/people`: customer-owned family members and saved addresses.

## UX rules

The interface always keeps service, recipient, place, time, duration, cost, and next step visible. It labels all amounts as estimated until payment exists, uses inline validation and async feedback, explains the non-medical boundary, and avoids fake provider assignments.

The wizard uses server APIs for estimates and creation. The browser may show a preview calculation for continuity, but the API recalculates and stores the authoritative estimate.
