import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/common/Button';
import { GameCard } from './components/GameCard';
import { GameForm } from './components/GameForm';
import { GameFilters } from './components/GameFilters';
import { Game } from '@/types/models/Game';
import { Plus, PackageX } from 'lucide-react';

export function Games() {
  const { games, gameFilters, deleteGame, showAlert } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Search filter
    if (gameFilters.search) {
      const search = gameFilters.search.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(search) ||
          game.editor.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (gameFilters.types.length > 0) {
      filtered = filtered.filter((game) => gameFilters.types.includes(game.type));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[gameFilters.sortBy];
      let bVal: any = b[gameFilters.sortBy];

      if (gameFilters.sortBy === 'releaseDate') {
        aVal = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        bVal = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      }

      if (gameFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [games, gameFilters]);

  const handleEdit = (game: Game) => {
    setSelectedGame(game);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      deleteGame(id);
      showAlert('Jeu supprimé avec succès', 'success');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedGame(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Jeux</h1>
          <p className="text-text-medium">
            {filteredGames.length} jeu{filteredGames.length > 1 ? 'x' : ''} trouvé{filteredGames.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedGame(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un jeu
        </Button>
      </div>

      <GameFilters />

      {filteredGames.length === 0 ? (
        <div className="card text-center py-12">
          <PackageX className="w-16 h-16 mx-auto mb-4 text-text-medium" />
          <h3 className="text-xl font-bold mb-2">Aucun jeu trouvé</h3>
          <p className="text-text-medium mb-6">
            {games.length === 0
              ? 'Commencez par ajouter votre premier jeu'
              : 'Aucun jeu ne correspond à vos critères de recherche'}
          </p>
          {games.length === 0 && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedGame(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un jeu
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <GameForm isOpen={isFormOpen} onClose={handleCloseForm} game={selectedGame} />
    </div>
  );
}
