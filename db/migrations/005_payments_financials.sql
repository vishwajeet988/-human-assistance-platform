CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT, provider text NOT NULL, provider_order_id text NOT NULL UNIQUE,
  provider_payment_id text UNIQUE, status text NOT NULL CHECK (status IN ('CREATED','AUTHORIZED','CAPTURED','FAILED','REFUNDED','PARTIALLY_REFUNDED')),
  amount_minor integer NOT NULL CHECK (amount_minor >= 0), currency text NOT NULL, idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(customer_id, idempotency_key)
);
CREATE TABLE IF NOT EXISTS payment_webhook_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id text NOT NULL UNIQUE, event_type text NOT NULL, payload jsonb NOT NULL, processed_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS refunds (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), payment_id uuid NOT NULL REFERENCES payments(id), amount_minor integer NOT NULL CHECK (amount_minor > 0), reason text NOT NULL, status text NOT NULL CHECK(status IN ('REQUESTED','PROCESSING','COMPLETED','FAILED')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS provider_earnings_ledger (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), booking_id uuid NOT NULL REFERENCES bookings(id), provider_id uuid NOT NULL REFERENCES provider_profiles(user_id), gross_minor integer NOT NULL, commission_minor integer NOT NULL, net_minor integer NOT NULL, currency text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(booking_id, provider_id));
CREATE TABLE IF NOT EXISTS financial_audit_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid, event_type text NOT NULL, entity_id text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS payments_booking_idx ON payments(booking_id, status);
CREATE INDEX IF NOT EXISTS refunds_payment_idx ON refunds(payment_id, created_at DESC);
