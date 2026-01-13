-- Add Sample Data to Existing User
-- This script adds sample data (games, influencers, campaigns) to an existing user
--
-- HOW TO USE:
-- 1. Create a user normally through the signup page
-- 2. Get the user's UUID from Supabase Dashboard (Authentication > Users)
-- 3. Replace 'YOUR_USER_ID_HERE' below with the actual UUID
-- 4. Run this script in SQL Editor

-- ⚠️ IMPORTANT: Replace this UUID with your actual user ID!
DO $$
DECLARE
  target_user_id UUID := 'YOUR_USER_ID_HERE'; -- ← CHANGE THIS!
  game_catan_id UUID;
  game_pandemic_id UUID;
  game_wingspan_id UUID;
  game_7wonders_id UUID;
BEGIN
  -- Verify user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'User % does not exist. Please create a user first or check the UUID.', target_user_id;
  END IF;

  -- Clear existing data for this user (optional - remove if you want to keep existing data)
  DELETE FROM public.campaigns WHERE user_id = target_user_id;
  DELETE FROM public.influencers WHERE user_id = target_user_id;
  DELETE FROM public.games WHERE user_id = target_user_id;

  -- Create sample games
  INSERT INTO public.games (id, user_id, name, year, editor, players, duration, type, source)
  VALUES
    (gen_random_uuid(), target_user_id, 'Catan', '1995', 'Kosmos', '3-4', '90 min', 'Stratégie', 'manual'),
    (gen_random_uuid(), target_user_id, 'Pandemic', '2008', 'Z-Man Games', '2-4', '45 min', 'Coopératif', 'manual'),
    (gen_random_uuid(), target_user_id, 'Wingspan', '2019', 'Stonemaier Games', '1-5', '70 min', 'Stratégie', 'manual'),
    (gen_random_uuid(), target_user_id, '7 Wonders', '2010', 'Repos Production', '2-7', '30 min', 'Stratégie', 'manual'),
    (gen_random_uuid(), target_user_id, 'Azul', '2017', 'Plan B Games', '2-4', '45 min', 'Abstrait', 'manual'),
    (gen_random_uuid(), target_user_id, 'Ticket to Ride', '2004', 'Days of Wonder', '2-5', '60 min', 'Famille', 'manual')
  RETURNING id INTO game_wingspan_id;

  -- Get game IDs for reference
  SELECT id INTO game_catan_id FROM public.games WHERE user_id = target_user_id AND name = 'Catan';
  SELECT id INTO game_pandemic_id FROM public.games WHERE user_id = target_user_id AND name = 'Pandemic';
  SELECT id INTO game_wingspan_id FROM public.games WHERE user_id = target_user_id AND name = 'Wingspan';
  SELECT id INTO game_7wonders_id FROM public.games WHERE user_id = target_user_id AND name = '7 Wonders';

  -- Create sample influencers
  INSERT INTO public.influencers (
    id, user_id, name, platform, url, notes, subscribers,
    engagement, quality, specialties, location, pricing, availability
  ) VALUES
    (
      gen_random_uuid(),
      target_user_id,
      'BoardGameGeek TV',
      'YouTube',
      'https://youtube.com/@boardgamegeek',
      'Chaîne officielle avec reviews détaillées et actus du monde du jeu',
      250000,
      8,
      5,
      ARRAY['Stratégie', 'Expert', 'Reviews'],
      'États-Unis',
      '500-1000€',
      'Disponible'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'Shut Up & Sit Down',
      'YouTube',
      'https://youtube.com/@shutupandsitdown',
      'Reviews humoristiques et approfondies, très populaire dans la communauté',
      180000,
      9,
      5,
      ARRAY['Tout public', 'Narratif', 'Humour'],
      'Royaume-Uni',
      '1000-2000€',
      'Saturé'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'JeuxSocTV',
      'Twitch',
      'https://twitch.tv/jeuxsoctv',
      'Streams réguliers de parties en direct, très interactif avec la communauté',
      45000,
      7,
      4,
      ARRAY['Famille', 'Party Game', 'Live'],
      'France',
      '300-500€',
      'Disponible'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'Rahdo Runs Through',
      'YouTube',
      'https://youtube.com/@rahdo',
      'Playthroughs détaillés de jeux, audience très engagée',
      95000,
      9,
      4,
      ARRAY['Stratégie', 'Deux joueurs'],
      'États-Unis',
      '400-800€',
      'Disponible'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'Ludovox',
      'Blog',
      'https://ludovox.fr',
      'Site français de référence avec tests et actualités',
      30000,
      6,
      5,
      ARRAY['Stratégie', 'Expert', 'Actualités'],
      'France',
      '200-400€',
      'Disponible'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'The Dice Tower',
      'YouTube',
      'https://youtube.com/@thedicetower',
      'Network de reviewers, très grande audience',
      320000,
      7,
      5,
      ARRAY['Tout public', 'Reviews', 'Top Lists'],
      'États-Unis',
      '1500-3000€',
      'Saturé'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'JeuxDeSociété_FR',
      'Instagram',
      'https://instagram.com/jeuxdesociete_fr',
      'Compte Instagram avec belles photos et reviews courtes',
      28000,
      8,
      4,
      ARRAY['Famille', 'Party Game', 'Unboxing'],
      'France',
      '150-300€',
      'Disponible'
    );

  -- Create sample campaigns
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
    deliverables,
    notes
  ) VALUES
    (
      gen_random_uuid(),
      target_user_id,
      'Lancement Wingspan Extension',
      game_wingspan_id,
      'planned',
      2500.00,
      NOW() + INTERVAL '7 days',
      NOW() + INTERVAL '30 days',
      'Promouvoir la nouvelle extension européenne de Wingspan auprès de la communauté francophone',
      '[{"type":"video","description":"Review complète de 15min","delivered":false},{"type":"social","description":"3 posts Instagram","delivered":false}]'::jsonb,
      'Campagne de lancement avec 3 influenceurs principaux. Focus sur la beauté des illustrations.'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'Campagne Pandemic Legacy',
      game_pandemic_id,
      'in_progress',
      1500.00,
      NOW() - INTERVAL '5 days',
      NOW() + INTERVAL '15 days',
      'Série de streams en direct pour montrer le gameplay coopératif',
      '[{"type":"stream","description":"3 sessions de 2h","delivered":true}]'::jsonb,
      'Campagne en cours. Bon engagement sur les deux premières sessions.'
    ),
    (
      gen_random_uuid(),
      target_user_id,
      'Catan Championship 2024',
      game_catan_id,
      'completed',
      3000.00,
      NOW() - INTERVAL '60 days',
      NOW() - INTERVAL '30 days',
      'Couverture du championnat national de Catan',
      '[{"type":"video","description":"Highlights du tournoi","delivered":true},{"type":"article","description":"Interview des finalistes","delivered":true}]'::jsonb,
      'Campagne terminée avec succès. Très bon ROI, +40% de ventes durant la période.'
    );

  RAISE NOTICE '✓ Sample data added successfully for user %', target_user_id;
  RAISE NOTICE '✓ Created: 6 games, 7 influencers, 3 campaigns';
END $$;
