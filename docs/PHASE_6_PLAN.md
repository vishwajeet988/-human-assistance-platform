# Phase 6 plan — payments and financials

Phase 6 builds on the Phase 3 booking estimate and Phase 5 assignment workflow. It adds a payment adapter boundary, sandbox order/verification/webhook flows, idempotency, refunds, invoices, commission and provider earnings ledgers, plus protected admin financial views. Payment success is never accepted from the browser alone.

The development adapter uses deterministic HMAC verification and in-memory records. A Razorpay-compatible adapter contract is provided for configured sandbox credentials; production activation still requires a real gateway client and secrets. Payment confirmation moves a booking from `PENDING_PAYMENT` to `PAID`; matching remains a separate operation. Refund rules are centralized and currently permit refunds before service start, without claiming gateway settlement.

Tests cover payment success/failure, invalid and duplicate webhooks, refunds, commission/earnings, ownership and idempotency. Definition of done is passing all validation commands, documented financial boundaries, and one phase commit.
