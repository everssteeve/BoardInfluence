/**
 * YouTube Synchronization Service
 * High-level service to sync YouTube data for campaigns and influencers
 */

import type { Campaign } from '@/types/models/Campaign';
import type { Influencer } from '@/types/models/Influencer';
import type { YoutubeVideoMetrics } from '@/types/youtube';
import {
  fetchChannelMetrics,
  fetchVideoMetrics,
  fetchMultipleVideoMetrics,
  extractChannelId,
  extractVideoId,
} from './youtubeService';
import {
  calculateCampaignScore,
  calculateCampaignMetrics,
} from '@/utils/helpers/scoreHelpers';

/**
 * Sync YouTube metrics for an influencer
 */
export async function syncInfluencerYoutubeMetrics(
  influencer: Influencer
): Promise<Partial<Influencer>> {
  if (influencer.platform !== 'YouTube') {
    throw new Error('Influencer platform must be YouTube');
  }

  try {
    // Extract channel ID from URL if not already stored
    let channelId = influencer.youtubeChannelId;

    if (!channelId) {
      channelId = extractChannelId(influencer.url);
      if (!channelId) {
        throw new Error('Could not extract YouTube channel ID from URL. Please use a direct channel URL (youtube.com/channel/...)');
      }
    }

    // Fetch fresh metrics from YouTube
    const metrics = await fetchChannelMetrics(channelId);

    // Return updated influencer data
    return {
      youtubeChannelId: channelId,
      youtubeMetrics: metrics,
      lastYoutubeSync: new Date().toISOString(),
      // Update subscribers with real data
      subscribers: metrics.subscriberCount,
      // Auto-calculate engagement based on YouTube data (convert from % to 1-10 scale)
      engagement: Math.min(Math.round(metrics.engagementRate), 10),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to sync YouTube metrics: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Sync YouTube metrics for a campaign
 */
export async function syncCampaignYoutubeMetrics(
  campaign: Campaign
): Promise<Partial<Campaign>> {
  try {
    // Extract video IDs from deliverables
    const videoUrls = campaign.deliverables
      .filter((d) => d.url && d.completed)
      .map((d) => d.url!)
      .filter((url) => url.includes('youtube.com') || url.includes('youtu.be'));

    if (videoUrls.length === 0) {
      throw new Error('No completed YouTube videos found in campaign deliverables');
    }

    // Extract video IDs
    const videoIds = videoUrls
      .map((url) => extractVideoId(url))
      .filter((id): id is string => id !== null);

    if (videoIds.length === 0) {
      throw new Error('Could not extract video IDs from URLs');
    }

    // Fetch metrics for all videos
    const videoMetrics = await fetchMultipleVideoMetrics(videoIds);

    // Calculate campaign metrics and score
    const campaignMetrics = calculateCampaignMetrics(videoMetrics);
    const performanceScore = calculateCampaignScore(campaign, videoMetrics);

    // Update campaign metrics with the calculated score
    campaignMetrics.performanceScore = performanceScore;

    // Return updated campaign data
    return {
      youtubeMetrics: campaignMetrics,
      performanceScore,
      lastYoutubeSync: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to sync campaign metrics: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get video metrics for a single deliverable
 */
export async function getDeliverableMetrics(
  url: string
): Promise<YoutubeVideoMetrics | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      return null;
    }

    return await fetchVideoMetrics(videoId);
  } catch (error) {
    console.error('Error fetching deliverable metrics:', error);
    return null;
  }
}

/**
 * Batch sync multiple influencers
 */
export async function syncMultipleInfluencers(
  influencers: Influencer[],
  onProgress?: (current: number, total: number, influencer: Influencer) => void
): Promise<Array<{ influencer: Influencer; updates: Partial<Influencer> | null; error?: string }>> {
  const results: Array<{ influencer: Influencer; updates: Partial<Influencer> | null; error?: string }> = [];

  for (let i = 0; i < influencers.length; i++) {
    const influencer = influencers[i];

    if (onProgress) {
      onProgress(i + 1, influencers.length, influencer);
    }

    try {
      const updates = await syncInfluencerYoutubeMetrics(influencer);
      results.push({ influencer, updates });

      // Add delay to avoid hitting API rate limits
      if (i < influencers.length - 1) {
        await delay(500); // 500ms delay between requests
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ influencer, updates: null, error: errorMessage });
    }
  }

  return results;
}

/**
 * Batch sync multiple campaigns
 */
export async function syncMultipleCampaigns(
  campaigns: Campaign[],
  onProgress?: (current: number, total: number, campaign: Campaign) => void
): Promise<Array<{ campaign: Campaign; updates: Partial<Campaign> | null; error?: string }>> {
  const results: Array<{ campaign: Campaign; updates: Partial<Campaign> | null; error?: string }> = [];

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];

    if (onProgress) {
      onProgress(i + 1, campaigns.length, campaign);
    }

    try {
      const updates = await syncCampaignYoutubeMetrics(campaign);
      results.push({ campaign, updates });

      // Add delay to avoid hitting API rate limits
      if (i < campaigns.length - 1) {
        await delay(500); // 500ms delay between requests
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ campaign, updates: null, error: errorMessage });
    }
  }

  return results;
}

/**
 * Check if YouTube API is configured
 */
export function isYoutubeApiConfigured(): boolean {
  return !!import.meta.env.VITE_YOUTUBE_API_KEY;
}

/**
 * Check if an influencer needs YouTube sync
 * (hasn't been synced, or last sync was more than 7 days ago)
 */
export function needsYoutubeSync(
  entity: Influencer | Campaign,
  maxAgeDays: number = 7
): boolean {
  if (!entity.lastYoutubeSync) {
    return true;
  }

  const lastSync = new Date(entity.lastYoutubeSync);
  const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceSync >= maxAgeDays;
}

/**
 * Utility function to add delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
