import { Influencer } from '@/types/models/Influencer';
import { Campaign } from '@/types/models/Campaign';
import type { YoutubeCampaignMetrics, YoutubeVideoMetrics } from '@/types/youtube';

/**
 * Calculate influencer score (original algorithm)
 * This can now be enhanced with real YouTube data
 */
export function calculateInfluenceScore(influencer: Influencer): number {
  // If YouTube metrics are available, use them for a more accurate score
  if (influencer.youtubeMetrics && influencer.platform === 'YouTube') {
    return calculateYoutubeInfluencerScore(influencer);
  }

  // Fallback to original manual scoring
  const subscriberScore = Math.min(influencer.subscribers / 10000, 50);
  const engagementScore = influencer.engagement * 30;
  const qualityScore = influencer.quality * 10;
  return Math.round(subscriberScore + engagementScore + qualityScore);
}

/**
 * Calculate influencer score using real YouTube metrics
 */
export function calculateYoutubeInfluencerScore(influencer: Influencer): number {
  if (!influencer.youtubeMetrics) {
    return calculateInfluenceScore(influencer);
  }

  const metrics = influencer.youtubeMetrics;

  // Subscriber score (0-50 points)
  const subscriberScore = Math.min(metrics.subscriberCount / 10000, 50);

  // Engagement rate score (0-30 points)
  // YouTube engagement rate typically ranges from 1-10%
  const engagementScore = Math.min(metrics.engagementRate * 3, 30);

  // Video count & consistency score (0-10 points)
  const consistencyScore = Math.min(metrics.videoCount / 50, 10);

  // Average views score (0-10 points)
  const viewsScore = Math.min(metrics.averageViews / 5000, 10);

  const totalScore = subscriberScore + engagementScore + consistencyScore + viewsScore;
  return Math.round(totalScore);
}

/**
 * Calculate campaign performance score based on YouTube metrics
 * Score range: 0-100
 */
export function calculateCampaignScore(
  campaign: Campaign,
  videoMetrics: YoutubeVideoMetrics[]
): number {
  if (videoMetrics.length === 0) {
    return 0;
  }

  // Calculate aggregate metrics
  const totalViews = videoMetrics.reduce((sum, video) => sum + video.viewCount, 0);
  const totalLikes = videoMetrics.reduce((sum, video) => sum + video.likeCount, 0);
  const totalComments = videoMetrics.reduce((sum, video) => sum + video.commentCount, 0);
  const avgEngagement = videoMetrics.reduce((sum, video) => sum + video.engagementRate, 0) / videoMetrics.length;

  // Views score (0-40 points)
  // Considers total views relative to budget
  const budgetEfficiency = campaign.budget > 0 ? totalViews / campaign.budget : totalViews;
  const viewsScore = Math.min(budgetEfficiency / 100, 40);

  // Engagement score (0-30 points)
  // Based on average engagement rate across all videos
  const engagementScore = Math.min(avgEngagement * 3, 30);

  // Reach score (0-20 points)
  // Based on number of videos and total reach
  const reachScore = Math.min((videoMetrics.length * 2) + (totalViews / 10000), 20);

  // Interaction score (0-10 points)
  // Based on likes and comments ratio
  const interactionRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
  const interactionScore = Math.min(interactionRate * 10, 10);

  const totalScore = viewsScore + engagementScore + reachScore + interactionScore;
  return Math.round(totalScore);
}

/**
 * Calculate campaign metrics from video data
 */
export function calculateCampaignMetrics(
  videoMetrics: YoutubeVideoMetrics[]
): YoutubeCampaignMetrics {
  if (videoMetrics.length === 0) {
    return {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalVideos: 0,
      averageEngagementRate: 0,
      estimatedReach: 0,
      performanceScore: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  const totalViews = videoMetrics.reduce((sum, video) => sum + video.viewCount, 0);
  const totalLikes = videoMetrics.reduce((sum, video) => sum + video.likeCount, 0);
  const totalComments = videoMetrics.reduce((sum, video) => sum + video.commentCount, 0);
  const avgEngagement = videoMetrics.reduce((sum, video) => sum + video.engagementRate, 0) / videoMetrics.length;

  // Estimated reach considers unique viewers (approximated as 70% of total views for multi-video campaigns)
  const estimatedReach = Math.round(totalViews * 0.7);

  return {
    totalViews,
    totalLikes,
    totalComments,
    totalVideos: videoMetrics.length,
    averageEngagementRate: Math.round(avgEngagement * 100) / 100,
    estimatedReach,
    performanceScore: 0, // Will be calculated separately
    lastUpdated: new Date().toISOString(),
  };
}

export function getScoreClass(score: number): string {
  if (score < 30) return 'bg-danger/20 text-danger border-danger';
  if (score < 70) return 'bg-accent/20 text-accent border-accent';
  return 'bg-success/20 text-success border-success';
}

export function getScoreLabel(score: number): string {
  if (score < 30) return 'Faible';
  if (score < 70) return 'Moyen';
  return 'Élevé';
}

/**
 * Get campaign score class (adapted for 0-100 scale)
 */
export function getCampaignScoreClass(score: number): string {
  if (score < 40) return 'bg-danger/20 text-danger border-danger';
  if (score < 70) return 'bg-accent/20 text-accent border-accent';
  return 'bg-success/20 text-success border-success';
}

/**
 * Get campaign score label
 */
export function getCampaignScoreLabel(score: number): string {
  if (score < 40) return 'Faible';
  if (score < 70) return 'Moyen';
  return 'Excellent';
}
