ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS onboarding_status text NOT NULL DEFAULT 'REGISTERED' CHECK (onboarding_status IN ('REGISTERED', 'PROFILE_INCOMPLETE', 'PROFILE_COMPLETED', 'VERIFICATION_PENDING', 'VERIFICATION_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DEACTIVATED'));
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED'));
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS profile_photo_ref text;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT ARRAY[]::text[];
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS experience_summary text;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'Asia/Kolkata';

CREATE TABLE provider_services (
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  service_slug text NOT NULL REFERENCES service_categories(slug) ON DELETE RESTRICT,
  eligibility_status text NOT NULL DEFAULT 'PENDING' CHECK (eligibility_status IN ('PENDING', 'ELIGIBLE', 'INELIGIBLE')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider_id, service_slug)
);

CREATE TABLE provider_service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  city text NOT NULL,
  locality text NOT NULL,
  radius_km numeric(5,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, city, locality)
);

CREATE TABLE provider_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 1 AND 7),
  start_time time,
  end_time time,
  timezone text NOT NULL,
  kind text NOT NULL DEFAULT 'WEEKLY' CHECK (kind IN ('WEEKLY', 'BLACKOUT')),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'WEEKLY' AND day_of_week IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time) OR (kind = 'BLACKOUT' AND starts_at IS NOT NULL AND ends_at IS NOT NULL AND starts_at < ends_at))
);

CREATE INDEX provider_availability_provider_idx ON provider_availability (provider_id, active);

CREATE TABLE provider_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  document_type text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('NOT_STARTED', 'PENDING', 'IN_REVIEW', 'VERIFIED', 'FAILED', 'EXPIRED')),
  storage_ref text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  rejection_reason text
);

CREATE TABLE provider_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  verification_type text NOT NULL CHECK (verification_type IN ('IDENTITY', 'ADDRESS', 'BACKGROUND', 'TRAINING')),
  status text NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'PENDING', 'IN_REVIEW', 'VERIFIED', 'FAILED', 'EXPIRED')),
  external_reference text,
  submitted_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (provider_id, verification_type)
);

CREATE TABLE provider_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, provider_id)
);

CREATE TABLE provider_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX provider_verification_status_idx ON provider_profiles (onboarding_status, account_status);
CREATE INDEX provider_documents_provider_idx ON provider_documents (provider_id, status);
CREATE INDEX provider_audit_events_provider_idx ON provider_audit_events (provider_id, created_at DESC);
