import { Card } from '@/components/common/Card';
import { useStore } from '@/store';
import { useMemo } from 'react';
import { formatDate } from '@/utils/formatters/dateFormatter';
import { Clock, Gamepad2, User, Megaphone } from 'lucide-react';

type ActivityItem = {
  id: string;
  type: 'game' | 'influencer' | 'campaign';
  name: string;
  date: string;
  action: 'created' | 'updated';
};

export function RecentActivity() {
  const { games, influencers, campaigns } = useStore();

  const activities = useMemo(() => {
    const gameActivities: ActivityItem[] = games.map((game) => ({
      id: game.id,
      type: 'game',
      name: game.name,
      date: game.updatedAt,
      action: game.createdAt === game.updatedAt ? 'created' : 'updated',
    }));

    const influencerActivities: ActivityItem[] = influencers.map((inf) => ({
      id: inf.id,
      type: 'influencer',
      name: inf.name,
      date: inf.updatedAt,
      action: inf.createdAt === inf.updatedAt ? 'created' : 'updated',
    }));

    const campaignActivities: ActivityItem[] = campaigns.map((campaign) => ({
      id: campaign.id,
      type: 'campaign',
      name: campaign.name,
      date: campaign.updatedAt,
      action: campaign.createdAt === campaign.updatedAt ? 'created' : 'updated',
    }));

    return [...gameActivities, ...influencerActivities, ...campaignActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [games, influencers, campaigns]);

  if (activities.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-bold">Activité Récente</h2>
        </div>
        <p className="text-text-medium text-center py-8">Aucune activité récente</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-secondary" />
        <h2 className="text-xl font-bold">Activité Récente</h2>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const getIcon = () => {
            switch (activity.type) {
              case 'game':
                return <Gamepad2 className="w-4 h-4" />;
              case 'influencer':
                return <User className="w-4 h-4" />;
              case 'campaign':
                return <Megaphone className="w-4 h-4" />;
              default:
                return <Clock className="w-4 h-4" />;
            }
          };

          const getColorClass = () => {
            switch (activity.type) {
              case 'game':
                return 'bg-primary/10 text-primary';
              case 'influencer':
                return 'bg-secondary/10 text-secondary';
              case 'campaign':
                return 'bg-accent/10 text-accent';
              default:
                return 'bg-surface-darker text-text-medium';
            }
          };

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-darker transition-colors"
            >
              <div className={`p-2 rounded-lg ${getColorClass()}`}>
                {getIcon()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.name}</p>
                <p className="text-sm text-text-medium">
                  {activity.action === 'created' ? 'Créé' : 'Modifié'} {formatDate(activity.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
