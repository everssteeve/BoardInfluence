-- Migration: Add YouTube Integration Support
-- Adds columns for storing YouTube metrics and sync timestamps
-- for both influencers and campaigns

-- Add YouTube columns to influencers table
ALTER TABLE influencers
ADD COLUMN IF NOT EXISTS youtube_channel_id TEXT,
ADD COLUMN IF NOT EXISTS youtube_metrics JSONB,
ADD COLUMN IF NOT EXISTS last_youtube_sync TIMESTAMP WITH TIME ZONE;

-- Add YouTube columns to campaigns table
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS performance_score INTEGER,
ADD COLUMN IF NOT EXISTS youtube_metrics JSONB,
ADD COLUMN IF NOT EXISTS last_youtube_sync TIMESTAMP WITH TIME ZONE;

-- Create index on youtube_channel_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_influencers_youtube_channel_id
ON influencers(youtube_channel_id)
WHERE youtube_channel_id IS NOT NULL;

-- Create index on last_youtube_sync for finding stale data
CREATE INDEX IF NOT EXISTS idx_influencers_last_youtube_sync
ON influencers(last_youtube_sync)
WHERE last_youtube_sync IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_campaigns_last_youtube_sync
ON campaigns(last_youtube_sync)
WHERE last_youtube_sync IS NOT NULL;

-- Create index on performance_score for sorting campaigns by performance
CREATE INDEX IF NOT EXISTS idx_campaigns_performance_score
ON campaigns(performance_score)
WHERE performance_score IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN influencers.youtube_channel_id IS 'YouTube channel ID (e.g., UC...)';
COMMENT ON COLUMN influencers.youtube_metrics IS 'JSON object containing YouTube channel statistics';
COMMENT ON COLUMN influencers.last_youtube_sync IS 'Timestamp of last successful YouTube data sync';

COMMENT ON COLUMN campaigns.performance_score IS 'Calculated performance score (0-100) based on YouTube metrics';
COMMENT ON COLUMN campaigns.youtube_metrics IS 'JSON object containing aggregated YouTube campaign statistics';
COMMENT ON COLUMN campaigns.last_youtube_sync IS 'Timestamp of last successful YouTube data sync';
