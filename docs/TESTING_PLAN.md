# Testing Plan

## Unit

Test pricing, matching score, eligibility/verification gates, booking transition matrix, permissions, redaction, and notification routing.

## Integration

Run API plus PostgreSQL migrations against isolated test data. Cover registration, booking/payment idempotency, assignment, cancellation/refund, provider eligibility, incident creation, and authorization failures.

## End-to-end

Playwright covers customer registration/login, service browse and booking, provider acceptance/start/complete, family timeline, review, cancellation, refund, and emergency workflow.

## Quality gates

Format, lint, strict typecheck, unit/integration/E2E tests, production build, migration check, dependency audit, secret scan, and `git diff --check` before each phase commit.

