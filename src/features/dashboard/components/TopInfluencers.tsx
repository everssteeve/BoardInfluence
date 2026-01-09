import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useStore } from '@/store';
import { useMemo } from 'react';
import { calculateInfluenceScore } from '@/utils/helpers/scoreHelpers';
import { formatNumber } from '@/utils/formatters/numberFormatter';
import { Trophy, TrendingUp } from 'lucide-react';

export function TopInfluencers() {
  const { influencers, setCurrentTab } = useStore();

  const topInfluencers = useMemo(() => {
    return influencers
      .map((inf) => ({
        ...inf,
        score: calculateInfluenceScore(inf),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [influencers]);

  if (topInfluencers.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold">Top Influenceurs</h2>
        </div>
        <p className="text-text-medium text-center py-8">
          Aucun influenceur pour le moment
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold">Top Influenceurs</h2>
      </div>

      <div className="space-y-3">
        {topInfluencers.map((influencer, index) => (
          <div
            key={influencer.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-darker transition-colors cursor-pointer"
            onClick={() => setCurrentTab('influencers')}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{influencer.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary" size="sm">{influencer.platform}</Badge>
                <span className="text-sm text-text-medium">
                  {formatNumber(influencer.subscribers)} abonnés
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold font-mono">{influencer.score}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
