-- Create Test User Script
-- This script creates a test user with sample data for development/testing purposes
--
-- Test User Credentials:
-- Email: test@boardinfluence.com
-- Password: Test123!
--
-- ⚠️ WARNING: This should only be used in development environments!
-- DO NOT run this in production!

-- Generate a test user ID (you can replace this with any UUID)
DO $$
DECLARE
  test_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  test_email TEXT := 'test@boardinfluence.com';
  -- Password: Test123! (hashed with bcrypt)
  test_password_hash TEXT := '$2a$10$rHzJXKJQGYHVJvNHVHVBqOzLQKHVJvNHVHVBqOzLQKHVJvNHVHVBqO';
BEGIN
  -- Delete existing test user if exists (cleanup)
  DELETE FROM auth.users WHERE email = test_email;

  -- Insert test user into auth.users
  -- Note: In a real Supabase environment, you should use the Supabase Auth API
  -- This is a simplified version for testing
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token
  ) VALUES (
    test_user_id,
    '00000000-0000-0000-0000-000000000000',
    test_email,
    crypt('Test123!', gen_salt('bf')), -- Hash the password
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Utilisateur Test","company":"Test Company"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Create profile (if trigger doesn't work or for manual testing)
  INSERT INTO public.profiles (id, email, name, company)
  VALUES (
    test_user_id,
    test_email,
    'Utilisateur Test',
    'Test Company'
  ) ON CONFLICT (id) DO UPDATE
  SET name = 'Utilisateur Test', company = 'Test Company';

  -- Create sample games
  INSERT INTO public.games (id, user_id, name, year, editor, players, duration, type, source) VALUES
    (gen_random_uuid(), test_user_id, 'Catan', '1995', 'Kosmos', '3-4', '90 min', 'Stratégie', 'manual'),
    (gen_random_uuid(), test_user_id, 'Pandemic', '2008', 'Z-Man Games', '2-4', '45 min', 'Coopératif', 'manual'),
    (gen_random_uuid(), test_user_id, 'Wingspan', '2019', 'Stonemaier Games', '1-5', '70 min', 'Stratégie', 'manual'),
    (gen_random_uuid(), test_user_id, '7 Wonders', '2010', 'Repos Production', '2-7', '30 min', 'Stratégie', 'manual');

  -- Create sample influencers
  INSERT INTO public.influencers (
    id, user_id, name, platform, url, notes, subscribers,
    engagement, quality, specialties, location, pricing, availability
  ) VALUES
    (
      gen_random_uuid(),
      test_user_id,
      'BoardGameGeek TV',
      'YouTube',
      'https://youtube.com/@boardgamegeek',
      'Chaîne officielle de BoardGameGeek avec reviews détaillées',
      250000,
      8,
      5,
      ARRAY['Stratégie', 'Expert'],
      'États-Unis',
      '500-1000€',
      'Disponible'
    ),
    (
      gen_random_uuid(),
      test_user_id,
      'Shut Up & Sit Down',
      'YouTube',
      'https://youtube.com/@shutupandsitdown',
      'Reviews humoristiques et approfondies',
      180000,
      9,
      5,
      ARRAY['Tout public', 'Narratif'],
      'Royaume-Uni',
      '1000-2000€',
      'Saturé'
    ),
    (
      gen_random_uuid(),
      test_user_id,
      'JeuxSocTV',
      'Twitch',
      'https://twitch.tv/jeuxsoctv',
      'Streams réguliers de parties en direct',
      45000,
      7,
      4,
      ARRAY['Famille', 'Party Game'],
      'France',
      '300-500€',
      'Disponible'
    );

  -- Create sample campaign
  INSERT INTO public.campaigns (
    id,
    user_id,
    name,
    game_id,
    status,
    budget,
    start_date,
    end_date,
    objectives,
    notes
  ) VALUES (
    gen_random_uuid(),
    test_user_id,
    'Lancement Wingspan Extension',
    (SELECT id FROM public.games WHERE user_id = test_user_id AND name = 'Wingspan' LIMIT 1),
    'planned',
    2500.00,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '30 days',
    'Promouvoir la nouvelle extension européenne de Wingspan',
    'Campagne de lancement avec 3 influenceurs principaux'
  );

  RAISE NOTICE 'Test user created successfully!';
  RAISE NOTICE 'Email: %', test_email;
  RAISE NOTICE 'Password: Test123!';
  RAISE NOTICE 'User ID: %', test_user_id;
END $$;
