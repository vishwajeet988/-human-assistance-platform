# Phase 7 plan — family experience and notifications

Phase 7 extends existing family-member ownership and booking timelines with a family dashboard projection and notification domain abstraction. Notifications are generated from booking/payment/assignment events, deduplicated by event key, and delivered through in-app plus safe development adapters for email/SMS/WhatsApp. Channel delivery is configuration-dependent and never exposes private provider/customer details by default.

Family access remains customer-owned: a customer can see only dependents and bookings created by that customer. The family dashboard exposes service status, assignment-safe provider information, timeline events and a completion-summary projection. Tests cover ownership, event generation, channel abstraction and duplicate suppression.
