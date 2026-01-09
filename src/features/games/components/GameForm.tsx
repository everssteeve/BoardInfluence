import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Game, GameFormData } from '@/types/models/Game';
import { useStore } from '@/store';

interface GameFormProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
}

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

export function GameForm({ isOpen, onClose, game }: GameFormProps) {
  const { addGame, updateGame, showAlert } = useStore();

  const [formData, setFormData] = useState<GameFormData>({
    name: '',
    year: new Date().getFullYear().toString(),
    editor: '',
    players: '',
    duration: '',
    type: 'Stratégie',
    releaseDate: null,
  });

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        year: game.year,
        editor: game.editor,
        players: game.players,
        duration: game.duration,
        type: game.type,
        releaseDate: game.releaseDate,
      });
    } else {
      setFormData({
        name: '',
        year: new Date().getFullYear().toString(),
        editor: '',
        players: '',
        duration: '',
        type: 'Stratégie',
        releaseDate: null,
      });
    }
  }, [game, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.editor.trim()) {
      showAlert('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (game) {
      updateGame(game.id, formData);
      showAlert('Jeu modifié avec succès !', 'success');
    } else {
      const newGame: Game = {
        ...formData,
        id: crypto.randomUUID(),
        source: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addGame(newGame);
      showAlert('Jeu ajouté avec succès !', 'success');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={game ? 'Modifier le jeu' : 'Ajouter un jeu'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du jeu *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Wingspan"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Éditeur *"
            value={formData.editor}
            onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
            placeholder="Ex: Matagot"
            required
          />

          <Input
            label="Année"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2019"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Joueurs"
            value={formData.players}
            onChange={(e) => setFormData({ ...formData, players: e.target.value })}
            placeholder="1-5"
          />

          <Input
            label="Durée"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="45-90 min"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type de jeu</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
          >
            {GAME_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Date de sortie"
          type="date"
          value={formData.releaseDate || ''}
          onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value || null })}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {game ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
