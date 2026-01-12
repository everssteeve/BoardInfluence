-- BoardInfluence v3.0 - Initial Database Schema
-- Sprint 6: Multi-user Authentication & Data Isolation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- GAMES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  editor TEXT NOT NULL,
  players TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  release_date TEXT,
  source TEXT NOT NULL CHECK (source IN ('manual', 'api')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Users can view their own games"
  ON public.games
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own games"
  ON public.games
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
  ON public.games
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games"
  ON public.games
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX games_user_id_idx ON public.games(user_id);
CREATE INDEX games_name_idx ON public.games(name);
CREATE INDEX games_type_idx ON public.games(type);

-- =====================================================
-- INFLUENCERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('YouTube', 'Twitch', 'Blog', 'Instagram', 'TikTok', 'Podcast')),
  url TEXT NOT NULL,
  notes TEXT DEFAULT '',
  subscribers INTEGER NOT NULL DEFAULT 0,
  engagement INTEGER NOT NULL DEFAULT 1 CHECK (engagement >= 1 AND engagement <= 10),
  quality INTEGER NOT NULL DEFAULT 1 CHECK (quality >= 1 AND quality <= 5),
  specialties TEXT[] DEFAULT '{}',
  location TEXT DEFAULT '',
  pricing TEXT NOT NULL DEFAULT 'Non communiqué',
  pricing_notes TEXT DEFAULT '',
  availability TEXT NOT NULL DEFAULT 'Disponible' CHECK (availability IN ('Disponible', 'Saturé', 'Ne répond plus')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- Influencers policies
CREATE POLICY "Users can view their own influencers"
  ON public.influencers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own influencers"
  ON public.influencers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own influencers"
  ON public.influencers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own influencers"
  ON public.influencers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX influencers_user_id_idx ON public.influencers(user_id);
CREATE INDEX influencers_name_idx ON public.influencers(name);
CREATE INDEX influencers_platform_idx ON public.influencers(platform);

-- =====================================================
-- CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  influencer_ids UUID[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  budget DECIMAL(10, 2) NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  objectives TEXT DEFAULT '',
  deliverables JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Users can view their own campaigns"
  ON public.campaigns
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON public.campaigns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON public.campaigns
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON public.campaigns
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX campaigns_user_id_idx ON public.campaigns(user_id);
CREATE INDEX campaigns_game_id_idx ON public.campaigns(game_id);
CREATE INDEX campaigns_status_idx ON public.campaigns(status);
CREATE INDEX campaigns_start_date_idx ON public.campaigns(start_date);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANTS
-- =====================================================
-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.games TO authenticated;
GRANT ALL ON public.influencers TO authenticated;
GRANT ALL ON public.campaigns TO authenticated;
