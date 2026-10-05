INSERT INTO roles (name) VALUES ('CUSTOMER'), ('PROVIDER'), ('ADMIN'), ('SUPPORT')
ON CONFLICT (name) DO NOTHING;

INSERT INTO service_categories (slug, name, description, short_description, long_description, icon_key, display_order, duration_options_minutes, base_price_minor, hourly_rate_minor, customer_requirements) VALUES
  ('hospital-appointment-companion', 'Hospital / Appointment Companion', 'Non-medical accompaniment and practical support.', 'A calm companion for appointments and facility visits.', 'A trained non-medical companion can help navigate a facility, support registration and waiting, collect documents, pick up pharmacy items, and help with the return home. This service does not include diagnosis, treatment, injections, nursing, clinical monitoring, or emergency medical care.', 'calendar-heart', 1, ARRAY[60,120,240,360], 39900, 29900, ARRAY['Appointment or visit details', 'Meeting instructions']),
  ('elder-companion', 'Elder Companion', 'Friendly visits, errands, and everyday assistance.', 'Thoughtful company and practical help for older adults.', 'Arrange a check-in visit, walking companion, grocery or pharmacy assistance, or help with a local errand. This is non-medical companionship and practical support, not nursing or clinical care.', 'sunrise', 2, ARRAY[60,120,240,360,480], 34900, 24900, ARRAY['Recipient details', 'Any mobility or meeting considerations']),
  ('pet-assistance', 'Pet Assistance', 'Practical support for pets and their people.', 'Reliable help for walks, visits, and pet appointments.', 'We can help with a vet visit, grooming pickup or drop-off, walking, pet sitting, or medicine pickup. We do not provide veterinary treatment or make medical decisions for pets.', 'paw', 3, ARRAY[60,120,240,480], 29900, 19900, ARRAY['Pet name and behavior notes', 'Vet or grooming details where relevant']),
  ('everyday-assistance', 'Everyday Assistance', 'Practical support for local errands and accompaniment.', 'A helping hand for everyday tasks and local errands.', 'Arrange grocery assistance, document collection, shopping, or accompaniment to an appropriate appointment or office. Regulated, legal, financial, and professional services remain the customer’s responsibility.', 'hand-heart', 4, ARRAY[60,120,240,360], 29900, 19900, ARRAY['Task details', 'Shopping list or collection instructions where relevant'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description) SELECT id, name, slug, short_description FROM service_categories WHERE slug IN ('hospital-appointment-companion', 'elder-companion', 'pet-assistance', 'everyday-assistance') ON CONFLICT (slug) DO NOTHING;

-- Development/demo identities only. These are not real providers and must never be presented as real verification.
INSERT INTO users (id, email, display_name) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'demo-provider-incomplete@example.test', 'DEVELOPMENT / DEMO - Profile incomplete'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'demo-provider-approved@example.test', 'DEVELOPMENT / DEMO - Approved'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'demo-provider-suspended@example.test', 'DEVELOPMENT / DEMO - Suspended')
ON CONFLICT (id) DO NOTHING;

INSERT INTO provider_profiles (user_id, display_name, onboarding_status, account_status, timezone, bio, experience_summary) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'DEVELOPMENT / DEMO - Profile incomplete', 'PROFILE_INCOMPLETE', 'ACTIVE', 'Asia/Kolkata', NULL, NULL),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'DEVELOPMENT / DEMO - Approved', 'APPROVED', 'ACTIVE', 'Asia/Kolkata', 'Development-only approved profile. Not a real person.', 'Development demo profile'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'DEVELOPMENT / DEMO - Suspended', 'SUSPENDED', 'SUSPENDED', 'Asia/Kolkata', NULL, NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO provider_services (provider_id, service_slug, eligibility_status) VALUES
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'elder-companion', 'ELIGIBLE')
ON CONFLICT (provider_id, service_slug) DO NOTHING;
