import { useState, useMemo } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { useStore } from '@/store';
import { Search, Gamepad2, User } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { games, influencers, setCurrentTab } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      return { games: [], influencers: [] };
    }

    const term = searchTerm.toLowerCase();

    const gameResults = games.filter(
      (game) =>
        game.name.toLowerCase().includes(term) ||
        game.editor.toLowerCase().includes(term) ||
        game.type.toLowerCase().includes(term)
    );

    const influencerResults = influencers.filter(
      (inf) =>
        inf.name.toLowerCase().includes(term) ||
        inf.platform.toLowerCase().includes(term) ||
        inf.location.toLowerCase().includes(term) ||
        inf.notes.toLowerCase().includes(term)
    );

    return {
      games: gameResults.slice(0, 10),
      influencers: influencerResults.slice(0, 10),
    };
  }, [searchTerm, games, influencers]);

  const totalResults = results.games.length + results.influencers.length;

  const handleGameClick = () => {
    setCurrentTab('games');
    onClose();
  };

  const handleInfluencerClick = () => {
    setCurrentTab('influencers');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recherche globale"
      size="large"
    >
      <div className="space-y-4">
        <Input
          placeholder="Rechercher dans les jeux et influenceurs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          autoFocus
        />

        {searchTerm && (
          <p className="text-sm text-text-medium">
            {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
          </p>
        )}

        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Games Results */}
          {results.games.length > 0 && (
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                Jeux ({results.games.length})
              </h3>
              <div className="space-y-2">
                {results.games.map((game) => (
                  <button
                    key={game.id}
                    onClick={handleGameClick}
                    className="w-full p-3 rounded-lg bg-surface hover:bg-surface-darker transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{game.name}</p>
                        <p className="text-sm text-text-medium">
                          {game.editor} • {game.year}
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {game.type}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Influencers Results */}
          {results.influencers.length > 0 && (
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                Influenceurs ({results.influencers.length})
              </h3>
              <div className="space-y-2">
                {results.influencers.map((inf) => (
                  <button
                    key={inf.id}
                    onClick={handleInfluencerClick}
                    className="w-full p-3 rounded-lg bg-surface hover:bg-surface-darker transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{inf.name}</p>
                        <p className="text-sm text-text-medium">{inf.location}</p>
                      </div>
                      <Badge variant="secondary" size="sm">
                        {inf.platform}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchTerm && totalResults === 0 && (
            <div className="text-center py-8 text-text-medium">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun résultat trouvé pour "{searchTerm}"</p>
            </div>
          )}

          {/* Empty State */}
          {!searchTerm && (
            <div className="text-center py-8 text-text-medium">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Commencez à taper pour rechercher...</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
