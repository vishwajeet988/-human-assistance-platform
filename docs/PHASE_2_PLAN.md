# Phase 2 Plan — Design System, Authentication & Application Shell

## Existing Phase 1 foundation

- npm workspace monorepo with `apps/api` and `apps/web`.
- Strict TypeScript configuration and passing workspace tests/builds.
- PostgreSQL foundation migration with users, roles, OTP challenges, sessions, service categories, bookings, and audit records.
- Fastify health/readiness endpoints under `/api/v1`.
- Server-side RBAC and booking state-machine primitives.
- Production configuration guard against the development JWT secret.
- Next.js App Router web application with a minimal landing screen.

## Phase 2 additions

- Configurable neutral product identity (`Project Companion`) with metadata placeholders.
- Central design tokens for color, typography, spacing, motion, radii, shadows, breakpoints, and layers.
- Reusable accessible web primitives: buttons, icon buttons, inputs, badges, cards, avatars, empty/error/loading states, and shell navigation.
- Public landing page refresh using the design system.
- Sign-in and OTP verification screens with safe, generic authentication messaging.
- Customer, provider, and operations application-shell routes with role-specific navigation.
- Route-level role boundary utility for future server-session enforcement.

## Expected files/modules

- `apps/web/lib/brand.ts`, `apps/web/lib/auth.ts`
- `apps/web/components/ui/*`
- `apps/web/components/shell/*`
- `apps/web/app/auth/*`, `apps/web/app/app/*`, `apps/web/app/provider/*`, `apps/web/app/operations/*`
- `apps/web/app/globals.css`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`

## Dependencies

Phase 2 uses the existing Next.js, React, and TypeScript dependencies. No UI kit is added; the product needs a small owned system with predictable accessibility and styling. Authentication screens target the existing OTP/session schema and remain honest about backend persistence wiring until the database adapter is connected.

## Testing approach

- Typecheck and production-build all workspaces.
- Exercise API tests unchanged.
- Keep components semantic and keyboard accessible.
- Verify route structure and generic auth copy through the build; add browser automation once the web test harness is introduced.

## Definition of done

- A final brand name can be changed in one configuration module.
- Public, auth, customer, provider, and operations surfaces share the same tokens/components.
- Auth screens never expose whether an account exists or display OTPs.
- Navigation is responsive, role-specific, and has visible focus states.
- Phase 2 does not implement marketplace search, payments, live tracking, or provider matching.
- Tests, typecheck, build, and diff checks pass.
