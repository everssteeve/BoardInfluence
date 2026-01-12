import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Campaign } from '@/types/models/Campaign';
import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';
import { calculateInfluenceScore } from '@/utils/helpers/scoreHelpers';
import { Users, Trophy, MapPin, DollarSign } from 'lucide-react';

interface CampaignInfluencerListProps {
  campaign: Campaign;
  game?: Game;
  influencers: Influencer[];
}

export function CampaignInfluencerList({ campaign, game, influencers }: CampaignInfluencerListProps) {
  const campaignInfluencers = influencers.filter((inf) =>
    campaign.influencerIds.includes(inf.id)
  );

  if (campaignInfluencers.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          Influenceurs de la campagne
        </h3>
        <p className="text-text-medium text-center py-4">
          Aucun influenceur assigné à cette campagne
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-secondary" />
        Influenceurs de la campagne {game && `- ${game.name}`}
      </h3>

      <div className="space-y-4">
        {campaignInfluencers.map((influencer) => {
          const score = calculateInfluenceScore(influencer);
          const hasWorkedOnGame = game && influencer.games.some((g) => g.id === game.id);

          return (
            <div
              key={influencer.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-surface-darker hover:bg-surface transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold truncate">{influencer.name}</h4>
                  <Badge className="bg-secondary/20 text-secondary">
                    {influencer.platform}
                  </Badge>
                  {hasWorkedOnGame && (
                    <Badge className="bg-success/20 text-success">
                      Déjà travaillé sur ce jeu
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-text-medium">
                    <Trophy className="w-4 h-4" />
                    <span>Score: {score}/100</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-medium">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{influencer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-medium">
                    <DollarSign className="w-4 h-4" />
                    <span className="truncate">{influencer.pricing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-medium">
                    <Users className="w-4 h-4" />
                    <span>{influencer.subscribers.toLocaleString()} abonnés</span>
                  </div>
                </div>

                {influencer.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {influencer.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {influencer.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{influencer.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
