import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { Campaign, Deliverable, CampaignStatus, DeliverableType } from '@/types/models/Campaign';

interface CampaignFormProps {
  campaign: Campaign | null;
  onClose: () => void;
}

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const { games, influencers, addCampaign, updateCampaign } = useStore();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    gameId: '',
    influencerIds: [] as string[],
    status: 'planned' as CampaignStatus,
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    objectives: '',
    notes: '',
  });
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        gameId: campaign.gameId,
        influencerIds: campaign.influencerIds,
        status: campaign.status,
        budget: campaign.budget,
        startDate: campaign.startDate.split('T')[0],
        endDate: campaign.endDate?.split('T')[0] || '',
        objectives: campaign.objectives,
        notes: campaign.notes,
      });
      setDeliverables(campaign.deliverables);
    }
  }, [campaign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.gameId || formData.influencerIds.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user && !campaign) {
      alert('Vous devez être connecté pour créer une campagne');
      return;
    }

    const now = new Date().toISOString();
    const campaignData: Campaign = {
      id: campaign?.id || `campaign-${Date.now()}`,
      userId: campaign?.userId || user!.id,
      ...formData,
      deliverables,
      createdAt: campaign?.createdAt || now,
      updatedAt: now,
    };

    if (campaign) {
      updateCampaign(campaign.id, campaignData);
    } else {
      addCampaign(campaignData);
    }

    onClose();
  };

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: `deliverable-${Date.now()}`,
        type: 'video',
        description: '',
        completed: false,
      },
    ]);
  };

  const updateDeliverable = (id: string, data: Partial<Deliverable>) => {
    setDeliverables(
      deliverables.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  const deleteDeliverable = (id: string) => {
    setDeliverables(deliverables.filter((d) => d.id !== id));
  };

  return (
    <Modal isOpen onClose={onClose} title={campaign ? 'Modifier la Campagne' : 'Nouvelle Campagne'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nom de la campagne"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Jeu *</label>
          <select
            className="input w-full"
            value={formData.gameId}
            onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
            required
          >
            <option value="">Sélectionner un jeu</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Influenceurs *</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-border-light rounded-lg p-3">
            {influencers.map((inf) => (
              <label key={inf.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.influencerIds.includes(inf.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        influencerIds: [...formData.influencerIds, inf.id],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        influencerIds: formData.influencerIds.filter((id) => id !== inf.id),
                      });
                    }
                  }}
                  className="rounded border-border-light"
                />
                <span className="text-sm">
                  {inf.name} ({inf.platform})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Statut</label>
          <select
            className="input w-full"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
          >
            <option value="planned">Planifiée</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Budget (€)</label>
          <input
            type="number"
            className="input w-full"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            min={0}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date de début"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <Input
            label="Date de fin (optionnelle)"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Objectifs</label>
          <textarea
            className="input w-full"
            rows={3}
            value={formData.objectives}
            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            placeholder="Décrire les objectifs de la campagne..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Livrables</label>
            <Button type="button" onClick={addDeliverable} variant="secondary" size="sm">
              <Plus size={16} />
              Ajouter
            </Button>
          </div>
          <div className="space-y-3">
            {deliverables.map((deliverable) => (
              <div key={deliverable.id} className="flex gap-2 items-start p-3 bg-bg-medium rounded-lg">
                <select
                  className="input flex-none w-32"
                  value={deliverable.type}
                  onChange={(e) =>
                    updateDeliverable(deliverable.id, { type: e.target.value as DeliverableType })
                  }
                >
                  <option value="video">Vidéo</option>
                  <option value="stream">Stream</option>
                  <option value="article">Article</option>
                  <option value="post">Post</option>
                  <option value="review">Review</option>
                  <option value="other">Autre</option>
                </select>
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Description..."
                  value={deliverable.description}
                  onChange={(e) => updateDeliverable(deliverable.id, { description: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => deleteDeliverable(deliverable.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            className="input w-full"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes additionnelles..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="secondary">
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            {campaign ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
