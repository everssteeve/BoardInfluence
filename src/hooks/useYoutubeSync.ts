import { useState } from 'react';
import { useStore } from '@/store';
import type { Campaign } from '@/types/models/Campaign';
import type { Influencer } from '@/types/models/Influencer';
import {
  syncInfluencerYoutubeMetrics,
  syncCampaignYoutubeMetrics,
  isYoutubeApiConfigured,
} from '@/services/youtube/youtubeSyncService';
import { influencersDB, campaignsDB } from '@/services/database/supabaseService';

interface UseSyncResult {
  isSyncing: boolean;
  error: string | null;
  isConfigured: boolean;
  syncInfluencer: (influencer: Influencer) => Promise<void>;
  syncCampaign: (campaign: Campaign) => Promise<void>;
}

export function useYoutubeSync(): UseSyncResult {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInfluencer = useStore((state) => state.updateInfluencer);
  const updateCampaign = useStore((state) => state.updateCampaign);
  const user = useStore((state) => state.user);

  const isConfigured = isYoutubeApiConfigured();

  const syncInfluencer = async (influencer: Influencer) => {
    if (!isConfigured) {
      setError('YouTube API non configurée. Veuillez ajouter VITE_YOUTUBE_API_KEY dans .env');
      throw new Error('YouTube API not configured');
    }

    if (influencer.platform !== 'YouTube') {
      setError('Cet influenceur n\'est pas sur YouTube');
      throw new Error('Not a YouTube influencer');
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Fetch YouTube metrics
      const updates = await syncInfluencerYoutubeMetrics(influencer);

      // Update in database
      const updatedInfluencer = await influencersDB.update(
        influencer.id,
        updates,
        user?.id || influencer.userId
      );

      // Update in store
      updateInfluencer(updatedInfluencer);

      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const syncCampaign = async (campaign: Campaign) => {
    if (!isConfigured) {
      setError('YouTube API non configurée. Veuillez ajouter VITE_YOUTUBE_API_KEY dans .env');
      throw new Error('YouTube API not configured');
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Fetch YouTube metrics
      const updates = await syncCampaignYoutubeMetrics(campaign);

      // Update in database
      const updatedCampaign = await campaignsDB.update(
        campaign.id,
        updates,
        user?.id || campaign.userId
      );

      // Update in store
      updateCampaign(updatedCampaign);

      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    error,
    isConfigured,
    syncInfluencer,
    syncCampaign,
  };
}
