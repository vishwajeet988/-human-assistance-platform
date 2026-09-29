# Architecture Decisions

## ADR-001: Start as a modular TypeScript monorepo

The repository is empty, so a workspace with separate web/API/shared modules gives clear boundaries without prematurely splitting into distributed services.

## ADR-002: PostgreSQL is the system of record

Bookings, payments, verification, safety, and audit history require relational constraints, transactions, and queryable timelines.

## ADR-003: Adapters for external providers

Payments, maps, messaging, storage, and verification will be interfaces with sandbox implementations. This prevents vendor coupling and avoids representing development mocks as real trust signals.

## ADR-004: Booking transitions are server-owned

The state machine and immutable event timeline live in the domain/API layer. Clients can request actions but cannot set arbitrary states.

