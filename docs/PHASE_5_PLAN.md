# Phase 5 plan — provider matching, requests and acceptance

## Current architecture

Phase 3 stores customer bookings in `CustomerStore`; Phase 4 adds provider profiles, eligibility, availability, audits and a repository interface with in-memory and PostgreSQL implementations. Booking states already include `SEARCHING_PROVIDER`, `PROVIDER_ASSIGNED` and `CONFIRMED`, but provider requests are only a reserved foundation. The development runtime remains explicitly in-memory until a PostgreSQL client is configured.

## Scope

Phase 5 adds a deterministic `MatchingService`, candidate filtering and explainable scoring, controlled provider requests, request expiry, provider accept/decline actions, atomic in-memory assignment semantics, customer-safe assignment visibility, and admin retry/manual assignment tools. Payment capture, notifications, GPS and automatic background workers remain out of scope.

## Eligibility and scoring

Candidates must be approved and active, eligible for the requested service, inside a structured city/locality service area, available for the requested time and duration, and free of overlapping assigned bookings. Scoring uses only available facts: service eligibility, service-area fit, availability fit, and language preference when supplied. It is deterministic and configured in one module; no fabricated rating, distance or reliability values are used.

## Request lifecycle

Requests move through `CREATED → SENT → VIEWED → ACCEPTED`, or to `DECLINED`, `EXPIRED` or `CANCELLED`. The backend checks expiration on every request action. A configurable top-candidate batch is used, with a default of three active requests and ten-minute expiry. Additional matching is explicit through retry/admin operations until a worker exists.

## Acceptance and concurrency

Acceptance revalidates provider status, service eligibility, availability, blackout periods and booking conflicts. The in-memory repository serializes the critical assignment operation; the PostgreSQL repository uses a transaction/row-lock contract for production wiring. The winner assigns the booking, transitions it to `PROVIDER_ASSIGNED`, resolves competing requests and records booking/audit events. A later acceptance receives a conflict response.

## Persistence and APIs

Provider request and assignment fields are added in migration `004_matching_requests.sql`. Repository interfaces remain the application boundary. APIs include provider request list/detail/view/accept/decline, customer assignment projection, admin matching inspection/retry/manual assignment/cancel requests, and customer booking state updates.

## Testing and definition of done

Tests cover every eligibility filter, scoring, request transitions and expiry, IDOR protection, acceptance races, assignment visibility, admin authorization, retry/manual assignment and repository SQL contracts. Completion requires passing `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`, updated documentation, and one clean commit.
