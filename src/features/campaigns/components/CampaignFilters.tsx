import { useStore } from '@/store';
import { Search } from 'lucide-react';
import { Input } from '@/components/common/Input/Input';
import { Card } from '@/components/common/Card/Card';

export function CampaignFilters() {
  const { campaignFilters, setCampaignFilters, games } = useStore();

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={campaignFilters.search}
          onChange={(e) => setCampaignFilters({ search: e.target.value })}
          icon={<Search size={18} />}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Statut</label>
          <select
            className="input w-full"
            value={campaignFilters.status[0] || ''}
            onChange={(e) =>
              setCampaignFilters({
                status: e.target.value ? [e.target.value as any] : [],
              })
            }
          >
            <option value="">Tous</option>
            <option value="planned">Planifiée</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Jeu</label>
          <select
            className="input w-full"
            value={campaignFilters.gameId || ''}
            onChange={(e) =>
              setCampaignFilters({ gameId: e.target.value || null })
            }
          >
            <option value="">Tous les jeux</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trier par</label>
          <select
            className="input w-full"
            value={`${campaignFilters.sortBy}-${campaignFilters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setCampaignFilters({
                sortBy: sortBy as any,
                sortOrder: sortOrder as any,
              });
            }}
          >
            <option value="startDate-desc">Date (plus récent)</option>
            <option value="startDate-asc">Date (plus ancien)</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
            <option value="budget-desc">Budget (plus élevé)</option>
            <option value="budget-asc">Budget (plus faible)</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
