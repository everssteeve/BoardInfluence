/**
 * Types for YouTube API integration
 * Used for calculating campaign scores and influencer engagement ratings
 */

export interface YoutubeChannelMetrics {
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  averageViews: number;
  engagementRate: number; // Calculated: (likes + comments) / views
  lastUpdated: string;
}

export interface YoutubeVideoMetrics {
  videoId: string;
  videoUrl: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  engagementRate: number; // Calculated: (likes + comments) / views
}

export interface YoutubeCampaignMetrics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalVideos: number;
  averageEngagementRate: number;
  estimatedReach: number;
  performanceScore: number; // 0-100 calculated score
  lastUpdated: string;
}

export interface YoutubeChannelResponse {
  kind: string;
  etag: string;
  items: Array<{
    id: string;
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
  }>;
}

export interface YoutubeVideoResponse {
  kind: string;
  etag: string;
  items: Array<{
    id: string;
    snippet: {
      publishedAt: string;
      title: string;
      description: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
}

export interface YoutubeApiError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}
