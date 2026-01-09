import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Game } from '@/types/models/Game';
import { Edit, Trash2, Calendar, Users as UsersIcon, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatters/dateFormatter';

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

export function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{game.name}</h3>
          <p className="text-text-medium">
            <span className="font-medium">{game.editor}</span> • {game.year}
          </p>
        </div>
        <Badge variant="primary">{game.type}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-text-medium text-sm">
          <UsersIcon className="w-4 h-4" />
          <span>{game.players} joueurs</span>
        </div>

        <div className="flex items-center gap-2 text-text-medium text-sm">
          <Clock className="w-4 h-4" />
          <span>{game.duration}</span>
        </div>

        {game.releaseDate && (
          <div className="flex items-center gap-2 text-text-medium text-sm">
            <Calendar className="w-4 h-4" />
            <span>Sortie: {formatDate(game.releaseDate)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-surface-darker">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(game)}
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(game.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
