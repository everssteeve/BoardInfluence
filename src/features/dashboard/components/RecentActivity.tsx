import { Card } from '@/components/common/Card';
import { useStore } from '@/store';
import { useMemo } from 'react';
import { formatDate } from '@/utils/formatters/dateFormatter';
import { Clock, Gamepad2, User } from 'lucide-react';

type ActivityItem = {
  id: string;
  type: 'game' | 'influencer';
  name: string;
  date: string;
  action: 'created' | 'updated';
};

export function RecentActivity() {
  const { games, influencers } = useStore();

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

    return [...gameActivities, ...influencerActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [games, influencers]);

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
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-darker transition-colors"
          >
            <div className={`p-2 rounded-lg ${activity.type === 'game' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              {activity.type === 'game' ? (
                <Gamepad2 className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.name}</p>
              <p className="text-sm text-text-medium">
                {activity.action === 'created' ? 'Créé' : 'Modifié'} {formatDate(activity.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
