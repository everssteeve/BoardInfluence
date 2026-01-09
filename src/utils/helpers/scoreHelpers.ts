import { Influencer } from '@/types/models/Influencer';

export function calculateInfluenceScore(influencer: Influencer): number {
  const subscriberScore = Math.min(influencer.subscribers / 10000, 50);
  const engagementScore = influencer.engagement * 30;
  const qualityScore = influencer.quality * 10;
  return Math.round(subscriberScore + engagementScore + qualityScore);
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
