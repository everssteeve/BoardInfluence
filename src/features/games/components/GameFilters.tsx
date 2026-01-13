import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useStore } from '@/store';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const GAME_TYPES = [
  'Stratégie',
  'Famille',
  'Party Game',
  'Coopératif',
  'Expert',
  'Deckbuilding',
  'Legacy',
  'Abstrait',
  '2 Joueurs',
  'Narratif',
];

export function GameFilters() {
  const { gameFilters, setGameFilters, resetGameFilters } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTypeToggle = (type: string) => {
    const types = gameFilters.types.includes(type)
      ? gameFilters.types.filter((t) => t !== type)
      : [...gameFilters.types, type];
    setGameFilters({ types });
  };

  return (
    <div className="card mb-6 space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un jeu..."
            value={gameFilters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameFilters({ search: e.target.value })}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <Button
          variant="secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtres
        </Button>

        {(gameFilters.search || gameFilters.types.length > 0) && (
          <Button variant="secondary" onClick={resetGameFilters}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="pt-4 border-t border-surface-darker space-y-4 animate-slide-down">
          <div>
            <label className="block text-sm font-medium mb-2">Types de jeux</label>
            <div className="flex flex-wrap gap-2">
              {GAME_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    gameFilters.types.includes(type)
                      ? 'bg-primary text-white'
                      : 'bg-surface-darker text-text-medium hover:bg-surface'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <select
                value={gameFilters.sortBy}
                onChange={(e) => setGameFilters({ sortBy: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
              >
                <option value="name">Nom</option>
                <option value="year">Année</option>
                <option value="releaseDate">Date de sortie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ordre</label>
              <select
                value={gameFilters.sortOrder}
                onChange={(e) => setGameFilters({ sortOrder: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
              >
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
