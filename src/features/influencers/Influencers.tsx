import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/common/Button';
import { InfluencerCard } from './components/InfluencerCard';
import { InfluencerForm } from './components/InfluencerForm';
import { InfluencerFilters } from './components/InfluencerFilters';
import { Influencer } from '@/types/models/Influencer';
import { Plus, UserX } from 'lucide-react';
import { calculateInfluenceScore } from '@/utils/helpers/scoreHelpers';

export function Influencers() {
  const { influencers, influencerFilters, deleteInfluencer, showAlert } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  const filteredInfluencers = useMemo(() => {
    let filtered = [...influencers];

    // Search filter
    if (influencerFilters.search) {
      const search = influencerFilters.search.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.name.toLowerCase().includes(search) ||
          inf.location.toLowerCase().includes(search) ||
          inf.notes.toLowerCase().includes(search)
      );
    }

    // Platform filter
    if (influencerFilters.platform !== 'Tous') {
      filtered = filtered.filter((inf) => inf.platform === influencerFilters.platform);
    }

    // Specialties filter
    if (influencerFilters.specialties.length > 0) {
      filtered = filtered.filter((inf) =>
        influencerFilters.specialties.some((s) => inf.specialties.includes(s))
      );
    }

    // Availability filter
    if (influencerFilters.availabilities.length > 0) {
      filtered = filtered.filter((inf) =>
        influencerFilters.availabilities.includes(inf.availability)
      );
    }

    // Subscribers filter
    if (influencerFilters.minSubscribers > 0) {
      filtered = filtered.filter((inf) => inf.subscribers >= influencerFilters.minSubscribers);
    }

    // Quality filter
    if (influencerFilters.minQuality > 0) {
      filtered = filtered.filter((inf) => inf.quality >= influencerFilters.minQuality);
    }

    // Engagement filter
    if (influencerFilters.minEngagement > 0) {
      filtered = filtered.filter((inf) => inf.engagement >= influencerFilters.minEngagement);
    }

    // Sort
    const withScores = filtered.map((inf) => ({
      ...inf,
      score: calculateInfluenceScore(inf),
    }));

    withScores.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (influencerFilters.sortBy) {
        case 'score':
          aVal = a.score;
          bVal = b.score;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'subscribers':
          aVal = a.subscribers;
          bVal = b.subscribers;
          break;
        case 'recent':
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
          break;
        default:
          aVal = a.score;
          bVal = b.score;
      }

      if (influencerFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return withScores;
  }, [influencers, influencerFilters]);

  const handleEdit = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet influenceur ?')) {
      deleteInfluencer(id);
      showAlert('Influenceur supprimé avec succès', 'success');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedInfluencer(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Influenceurs</h1>
          <p className="text-text-medium">
            {filteredInfluencers.length} influenceur{filteredInfluencers.length > 1 ? 's' : ''} trouvé{filteredInfluencers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedInfluencer(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un influenceur
        </Button>
      </div>

      <InfluencerFilters />

      {filteredInfluencers.length === 0 ? (
        <div className="card text-center py-12">
          <UserX className="w-16 h-16 mx-auto mb-4 text-text-medium" />
          <h3 className="text-xl font-bold mb-2">Aucun influenceur trouvé</h3>
          <p className="text-text-medium mb-6">
            {influencers.length === 0
              ? 'Commencez par ajouter votre premier influenceur'
              : 'Aucun influenceur ne correspond à vos critères de recherche'}
          </p>
          {influencers.length === 0 && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedInfluencer(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un influenceur
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <InfluencerForm isOpen={isFormOpen} onClose={handleCloseForm} influencer={selectedInfluencer} />
    </div>
  );
}
