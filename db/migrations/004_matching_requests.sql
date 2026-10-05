ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS sent_at timestamptz;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS viewed_at timestamptz;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS responded_at timestamptz;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS decline_reason text;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS matching_score numeric(8,2);
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS score_reasons text[] NOT NULL DEFAULT ARRAY[]::text[];
ALTER TABLE provider_requests DROP CONSTRAINT IF EXISTS provider_requests_status_check;
ALTER TABLE provider_requests ADD CONSTRAINT provider_requests_status_check CHECK (status IN ('CREATED', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED'));
CREATE INDEX IF NOT EXISTS provider_requests_provider_status_idx ON provider_requests (provider_id, status, expires_at);
CREATE INDEX IF NOT EXISTS provider_requests_booking_status_idx ON provider_requests (booking_id, status);
CREATE INDEX IF NOT EXISTS provider_requests_expiration_idx ON provider_requests (expires_at) WHERE status IN ('CREATED', 'SENT', 'VIEWED');

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_provider_id uuid REFERENCES provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS bookings_assigned_provider_time_idx ON bookings (assigned_provider_id, scheduled_start) WHERE assigned_provider_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS matching_request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES provider_requests(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  actor_id uuid REFERENCES users(id),
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS matching_request_events_request_idx ON matching_request_events (request_id, created_at DESC);
