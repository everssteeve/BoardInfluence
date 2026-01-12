import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { CampaignCard } from './components/CampaignCard';
import { CampaignForm } from './components/CampaignForm';
import { CampaignFilters } from './components/CampaignFilters';
import { Campaign } from '@/types/models/Campaign';

export function Campaigns() {
  const { campaigns, games, influencers, campaignFilters, deleteCampaign } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    // Search
    if (campaignFilters.search) {
      const searchLower = campaignFilters.search.toLowerCase();
      filtered = filtered.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.objectives.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (campaignFilters.status.length > 0) {
      filtered = filtered.filter((campaign) =>
        campaignFilters.status.includes(campaign.status)
      );
    }

    // Game filter
    if (campaignFilters.gameId) {
      filtered = filtered.filter((campaign) =>
        campaign.gameId === campaignFilters.gameId
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[campaignFilters.sortBy];
      let bValue: any = b[campaignFilters.sortBy];

      if (campaignFilters.sortBy === 'startDate') {
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
      } else if (campaignFilters.sortBy === 'budget') {
        aValue = a.budget;
        bValue = b.budget;
      } else if (campaignFilters.sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (campaignFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [campaigns, campaignFilters]);

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      deleteCampaign(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCampaign(null);
  };

  if (campaigns.length === 0 && !showForm) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2">Aucune Campagne</h2>
          <p className="text-text-medium mb-6">
            Créez votre première campagne pour suivre vos collaborations
          </p>
          <Button onClick={() => setShowForm(true)} variant="primary">
            <Plus size={20} />
            Nouvelle Campagne
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campagnes</h1>
        <Button onClick={() => setShowForm(true)} variant="primary">
          <Plus size={20} />
          Nouvelle Campagne
        </Button>
      </div>

      <CampaignFilters />

      {filteredCampaigns.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-medium">Aucune campagne ne correspond aux filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              game={games.find((g) => g.id === campaign.gameId)}
              influencers={influencers.filter((inf) =>
                campaign.influencerIds.includes(inf.id)
              )}
              onEdit={() => handleEdit(campaign)}
              onDelete={() => handleDelete(campaign.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CampaignForm campaign={editingCampaign} onClose={handleCloseForm} />
      )}
    </div>
  );
}
