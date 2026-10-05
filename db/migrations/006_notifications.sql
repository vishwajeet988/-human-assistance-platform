CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_key text NOT NULL, channel text NOT NULL CHECK(channel IN ('IN_APP','EMAIL','SMS','WHATSAPP','PUSH')),
  title text NOT NULL, body text NOT NULL, status text NOT NULL CHECK(status IN ('PENDING','SENT','FAILED','READ')),
  created_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz, UNIQUE(recipient_id, event_key, channel)
);
CREATE INDEX IF NOT EXISTS notifications_recipient_idx ON notifications(recipient_id, created_at DESC);
