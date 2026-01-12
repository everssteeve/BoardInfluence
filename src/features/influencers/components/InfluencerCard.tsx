import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Influencer } from '@/types/models/Influencer';
import { Edit, Trash2, ExternalLink, MapPin, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '@/utils/formatters/numberFormatter';
import { calculateInfluenceScore } from '@/utils/helpers/scoreHelpers';

interface InfluencerCardProps {
  influencer: Influencer;
  onEdit: (influencer: Influencer) => void;
  onDelete: (id: string) => void;
}

export function InfluencerCard({ influencer, onEdit, onDelete }: InfluencerCardProps) {
  const navigate = useNavigate();
  const score = calculateInfluenceScore(influencer);

  const availabilityColor = {
    'Disponible': 'success',
    'Saturé': 'warning',
    'Ne répond plus': 'danger',
  } as const;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold">{influencer.name}</h3>
            {influencer.url && (
              <a
                href={influencer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{influencer.platform}</Badge>
            <Badge variant={availabilityColor[influencer.availability]}>
              {influencer.availability}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-br from-primary/10 to-accent/10 px-3 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold font-mono">{score}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-text-medium text-sm">
          <span className="font-medium">{formatNumber(influencer.subscribers)}</span>
          <span>abonnés</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-medium">Engagement:</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded-sm ${
                  i < influencer.engagement ? 'bg-primary' : 'bg-surface-darker'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-medium">Qualité:</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-4 rounded-sm ${
                  i < influencer.quality ? 'bg-accent' : 'bg-surface-darker'
                }`}
              />
            ))}
          </div>
        </div>

        {influencer.location && (
          <div className="flex items-center gap-2 text-text-medium text-sm">
            <MapPin className="w-4 h-4" />
            <span>{influencer.location}</span>
          </div>
        )}

        {influencer.pricing && (
          <div className="flex items-center gap-2 text-text-medium text-sm">
            <DollarSign className="w-4 h-4" />
            <span>{influencer.pricing}</span>
          </div>
        )}
      </div>

      {influencer.specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {influencer.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-1 text-xs rounded bg-surface-darker text-text-medium"
              >
                {specialty}
              </span>
            ))}
            {influencer.specialties.length > 3 && (
              <span className="px-2 py-1 text-xs rounded bg-surface-darker text-text-medium">
                +{influencer.specialties.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {influencer.notes && (
        <p className="text-sm text-text-medium mb-4 line-clamp-2">{influencer.notes}</p>
      )}

      <div className="flex gap-2 pt-4 border-t border-surface-darker">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/influencers/${influencer.id}`)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Voir
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(influencer)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(influencer.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
