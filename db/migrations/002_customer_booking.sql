ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS icon_key text;
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS duration_options_minutes integer[] NOT NULL DEFAULT ARRAY[60,120,240];
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS base_price_minor integer NOT NULL DEFAULT 0 CHECK (base_price_minor >= 0);
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS hourly_rate_minor integer NOT NULL DEFAULT 0 CHECK (hourly_rate_minor >= 0);
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS customer_requirements text[] NOT NULL DEFAULT ARRAY[]::text[];
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS provider_requirements text[] NOT NULL DEFAULT ARRAY[]::text[];
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  pricing_type text NOT NULL DEFAULT 'DURATION' CHECK (pricing_type IN ('DURATION', 'HOURLY')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX services_category_active_idx ON services (category_id, active);

CREATE TABLE family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX family_members_customer_idx ON family_members (customer_id, created_at);

CREATE TABLE customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label text NOT NULL,
  recipient_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  locality text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  instructions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX customer_addresses_customer_idx ON customer_addresses (customer_id, created_at);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS family_member_id uuid REFERENCES family_members(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES customer_addresses(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_minutes integer CHECK (duration_minutes > 0);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS requirements text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS emergency_contact jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS estimate_amount_minor integer CHECK (estimate_amount_minor >= 0);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS idempotency_key text;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_customer_idempotency_idx ON bookings (customer_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

ALTER TABLE booking_events ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'BOOKING_UPDATED';
ALTER TABLE booking_events ADD COLUMN IF NOT EXISTS customer_visible boolean NOT NULL DEFAULT true;
