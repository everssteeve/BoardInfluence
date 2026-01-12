import { Calendar, Edit, Trash2, Users, DollarSign, Target, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { Campaign } from '@/types/models/Campaign';
import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';
import { formatDate } from '@/utils/formatters/dateFormatter';

interface CampaignCardProps {
  campaign: Campaign;
  game?: Game;
  influencers: Influencer[];
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_COLORS = {
  planned: 'bg-secondary/20 text-secondary',
  in_progress: 'bg-accent/20 text-accent',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-danger/20 text-danger',
};

const STATUS_LABELS = {
  planned: 'Planifiée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export function CampaignCard({ campaign, game, influencers, onEdit, onDelete }: CampaignCardProps) {
  const navigate = useNavigate();
  const completedDeliverables = campaign.deliverables.filter((d) => d.completed).length;
  const totalDeliverables = campaign.deliverables.length;
  const progress = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
          <Badge className={STATUS_COLORS[campaign.status]}>
            {STATUS_LABELS[campaign.status]}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/campaigns/${campaign.id}`)} variant="secondary" size="sm">
            <Eye size={16} />
          </Button>
          <Button onClick={onEdit} variant="secondary" size="sm">
            <Edit size={16} />
          </Button>
          <Button onClick={onDelete} variant="danger" size="sm">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {game && (
        <div className="mb-4 p-3 bg-bg-medium rounded-lg">
          <div className="text-sm text-text-medium">Jeu</div>
          <div className="font-medium">{game.name}</div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-text-medium">
          <Calendar size={16} />
          <span>{formatDate(new Date(campaign.startDate))}</span>
          {campaign.endDate && (
            <>
              <span>→</span>
              <span>{formatDate(new Date(campaign.endDate))}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-text-medium">
          <Users size={16} />
          <span>{influencers.length} influenceur{influencers.length > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-medium">
          <DollarSign size={16} />
          <span>{campaign.budget.toLocaleString()}€</span>
        </div>

        {totalDeliverables > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-text-medium mb-2">
              <Target size={16} />
              <span>
                {completedDeliverables} / {totalDeliverables} livrables
              </span>
            </div>
            <div className="w-full bg-bg-medium rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {campaign.objectives && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="text-sm text-text-medium line-clamp-2">{campaign.objectives}</div>
        </div>
      )}
    </Card>
  );
}
