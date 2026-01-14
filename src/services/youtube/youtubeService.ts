/**
 * YouTube Data API v3 Integration Service
 * Provides methods to fetch channel and video statistics
 */

import type {
  YoutubeChannelMetrics,
  YoutubeVideoMetrics,
  YoutubeChannelResponse,
  YoutubeVideoResponse,
  YoutubeApiError,
} from '@/types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Get YouTube API key from environment variables
 */
function getApiKey(): string {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('Clé API YouTube non configurée. Veuillez définir VITE_YOUTUBE_API_KEY dans le fichier .env');
  }
  return apiKey;
}

/**
 * Extract channel ID from various YouTube URL formats
 */
export function extractChannelId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Format: youtube.com/channel/UC...
    if (urlObj.pathname.startsWith('/channel/')) {
      return urlObj.pathname.split('/channel/')[1]?.split('/')[0] || null;
    }

    // Format: youtube.com/c/channelname or youtube.com/@channelname
    // These require additional API call to resolve to channel ID
    if (urlObj.pathname.startsWith('/c/') || urlObj.pathname.startsWith('/@')) {
      return null; // Will need to use search API or handle separately
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Format: youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v');
    }

    // Format: youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1).split('?')[0];
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch channel statistics from YouTube API
 */
export async function fetchChannelMetrics(channelId: string): Promise<YoutubeChannelMetrics> {
  const apiKey = getApiKey();
  const url = `${YOUTUBE_API_BASE_URL}/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData: YoutubeApiError = await response.json();
      throw new Error(errorData.error.message || 'Échec de récupération des données de la chaîne');
    }

    const data: YoutubeChannelResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Chaîne introuvable');
    }

    const stats = data.items[0].statistics;
    const viewCount = parseInt(stats.viewCount, 10);
    const subscriberCount = parseInt(stats.subscriberCount, 10);
    const videoCount = parseInt(stats.videoCount, 10);
    const averageViews = videoCount > 0 ? Math.round(viewCount / videoCount) : 0;

    // Fetch recent videos to calculate engagement rate
    const recentVideos = await fetchRecentChannelVideos(channelId, 10);
    const engagementRate = calculateAverageEngagementRate(recentVideos);

    return {
      channelId,
      subscriberCount,
      viewCount,
      videoCount,
      averageViews,
      engagementRate,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur API YouTube: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch video statistics from YouTube API
 */
export async function fetchVideoMetrics(videoId: string): Promise<YoutubeVideoMetrics> {
  const apiKey = getApiKey();
  const url = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData: YoutubeApiError = await response.json();
      throw new Error(errorData.error.message || 'Échec de récupération des données de la vidéo');
    }

    const data: YoutubeVideoResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Vidéo introuvable');
    }

    const video = data.items[0];
    const viewCount = parseInt(video.statistics.viewCount || '0', 10);
    const likeCount = parseInt(video.statistics.likeCount || '0', 10);
    const commentCount = parseInt(video.statistics.commentCount || '0', 10);

    const engagementRate = viewCount > 0
      ? ((likeCount + commentCount) / viewCount) * 100
      : 0;

    return {
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      viewCount,
      likeCount,
      commentCount,
      duration: video.contentDetails.duration,
      engagementRate: Math.round(engagementRate * 100) / 100,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur API YouTube: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch recent videos from a channel
 */
async function fetchRecentChannelVideos(
  channelId: string,
  maxResults: number = 10
): Promise<YoutubeVideoMetrics[]> {
  const apiKey = getApiKey();

  // First, get video IDs from the channel
  const searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=id&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;

  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error('Échec de récupération des vidéos de la chaîne');
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    if (!videoIds) {
      return [];
    }

    // Then fetch statistics for all videos
    const videosUrl = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      throw new Error('Échec de récupération des statistiques de la vidéo');
    }

    const videosData: YoutubeVideoResponse = await videosResponse.json();

    return videosData.items.map((video) => {
      const viewCount = parseInt(video.statistics.viewCount || '0', 10);
      const likeCount = parseInt(video.statistics.likeCount || '0', 10);
      const commentCount = parseInt(video.statistics.commentCount || '0', 10);
      const engagementRate = viewCount > 0
        ? ((likeCount + commentCount) / viewCount) * 100
        : 0;

      return {
        videoId: video.id,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.snippet.title,
        publishedAt: video.snippet.publishedAt,
        viewCount,
        likeCount,
        commentCount,
        duration: video.contentDetails.duration,
        engagementRate: Math.round(engagementRate * 100) / 100,
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos récentes:', error);
    return [];
  }
}

/**
 * Calculate average engagement rate from multiple videos
 */
function calculateAverageEngagementRate(videos: YoutubeVideoMetrics[]): number {
  if (videos.length === 0) return 0;

  const totalEngagement = videos.reduce((sum, video) => sum + video.engagementRate, 0);
  return Math.round((totalEngagement / videos.length) * 100) / 100;
}

/**
 * Fetch metrics for multiple videos (used for campaigns)
 */
export async function fetchMultipleVideoMetrics(
  videoIds: string[]
): Promise<YoutubeVideoMetrics[]> {
  if (videoIds.length === 0) return [];

  const apiKey = getApiKey();
  const idsParam = videoIds.join(',');
  const url = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${idsParam}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData: YoutubeApiError = await response.json();
      throw new Error(errorData.error.message || 'Échec de récupération des données des vidéos');
    }

    const data: YoutubeVideoResponse = await response.json();

    return data.items.map((video) => {
      const viewCount = parseInt(video.statistics.viewCount || '0', 10);
      const likeCount = parseInt(video.statistics.likeCount || '0', 10);
      const commentCount = parseInt(video.statistics.commentCount || '0', 10);
      const engagementRate = viewCount > 0
        ? ((likeCount + commentCount) / viewCount) * 100
        : 0;

      return {
        videoId: video.id,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.snippet.title,
        publishedAt: video.snippet.publishedAt,
        viewCount,
        likeCount,
        commentCount,
        duration: video.contentDetails.duration,
        engagementRate: Math.round(engagementRate * 100) / 100,
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur API YouTube: ${error.message}`);
    }
    throw error;
  }
}
