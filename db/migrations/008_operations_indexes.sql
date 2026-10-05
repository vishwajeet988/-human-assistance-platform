CREATE INDEX IF NOT EXISTS bookings_state_created_idx ON bookings(state, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_customer_idx ON bookings(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS provider_requests_response_idx ON provider_requests(status, responded_at DESC);
CREATE INDEX IF NOT EXISTS financial_audit_events_type_idx ON financial_audit_events(event_type, created_at DESC);
