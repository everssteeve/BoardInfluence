import { Eye, ThumbsUp, MessageCircle, Users, TrendingUp, type LucideIcon } from 'lucide-react';
import type { YoutubeChannelMetrics, YoutubeCampaignMetrics } from '@/types/youtube';

interface YoutubeMetricsCardProps {
  metrics: YoutubeChannelMetrics | YoutubeCampaignMetrics;
  type: 'channel' | 'campaign';
}

export function YoutubeMetricsCard({ metrics, type }: YoutubeMetricsCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (type === 'channel') {
    const channelMetrics = metrics as YoutubeChannelMetrics;
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Métriques YouTube
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <MetricItem
            icon={Users}
            label="Abonnés"
            value={formatNumber(channelMetrics.subscriberCount)}
          />
          <MetricItem
            icon={Eye}
            label="Vues totales"
            value={formatNumber(channelMetrics.viewCount)}
          />
          <MetricItem
            icon={Eye}
            label="Vues moy."
            value={formatNumber(channelMetrics.averageViews)}
          />
          <MetricItem
            icon={TrendingUp}
            label="Engagement"
            value={`${channelMetrics.engagementRate.toFixed(2)}%`}
          />
        </div>
      </div>
    );
  }

  const campaignMetrics = metrics as YoutubeCampaignMetrics;
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Performance de la campagne
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <MetricItem
          icon={Eye}
          label="Vues totales"
          value={formatNumber(campaignMetrics.totalViews)}
        />
        <MetricItem
          icon={ThumbsUp}
          label="Likes"
          value={formatNumber(campaignMetrics.totalLikes)}
        />
        <MetricItem
          icon={MessageCircle}
          label="Commentaires"
          value={formatNumber(campaignMetrics.totalComments)}
        />
        <MetricItem
          icon={TrendingUp}
          label="Engagement"
          value={`${campaignMetrics.averageEngagementRate.toFixed(2)}%`}
        />
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Portée estimée</span>
          <span className="text-sm font-semibold text-foreground">
            {formatNumber(campaignMetrics.estimatedReach)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted">Score de performance</span>
          <span className="text-lg font-bold text-primary">
            {campaignMetrics.performanceScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function MetricItem({ icon: Icon, label, value }: MetricItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-muted" />
      <div className="flex flex-col">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}
