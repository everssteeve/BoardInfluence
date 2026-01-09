import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useStore } from '@/store';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { PLATFORMS } from '@/utils/constants/platforms';
import { SPECIALTIES } from '@/utils/constants/specialties';
import { AVAILABILITY_OPTIONS } from '@/utils/constants/availability';
import { Specialty, Availability } from '@/types/models/Influencer';

export function InfluencerFilters() {
  const { influencerFilters, setInfluencerFilters, resetInfluencerFilters } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSpecialtyToggle = (specialty: Specialty) => {
    const specialties = influencerFilters.specialties.includes(specialty)
      ? influencerFilters.specialties.filter((s) => s !== specialty)
      : [...influencerFilters.specialties, specialty];
    setInfluencerFilters({ specialties });
  };

  const handleAvailabilityToggle = (availability: Availability) => {
    const availabilities = influencerFilters.availabilities.includes(availability)
      ? influencerFilters.availabilities.filter((a) => a !== availability)
      : [...influencerFilters.availabilities, availability];
    setInfluencerFilters({ availabilities });
  };

  const hasActiveFilters =
    influencerFilters.search ||
    influencerFilters.platform !== 'Tous' ||
    influencerFilters.specialties.length > 0 ||
    influencerFilters.minSubscribers > 0;

  return (
    <div className="card mb-6 space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un influenceur..."
            value={influencerFilters.search}
            onChange={(e) => setInfluencerFilters({ search: e.target.value })}
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

        {hasActiveFilters && (
          <Button variant="secondary" onClick={resetInfluencerFilters}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="pt-4 border-t border-surface-darker space-y-4 animate-slide-down">
          <div>
            <label className="block text-sm font-medium mb-2">Plateforme</label>
            <select
              value={influencerFilters.platform}
              onChange={(e) => setInfluencerFilters({ platform: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
            >
              <option value="Tous">Toutes les plateformes</option>
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Spécialités</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    influencerFilters.specialties.includes(specialty)
                      ? 'bg-primary text-white'
                      : 'bg-surface-darker text-text-medium hover:bg-surface'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disponibilité</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((availability) => (
                <button
                  key={availability}
                  type="button"
                  onClick={() => handleAvailabilityToggle(availability)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    influencerFilters.availabilities.includes(availability)
                      ? 'bg-primary text-white'
                      : 'bg-surface-darker text-text-medium hover:bg-surface'
                  }`}
                >
                  {availability}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Abonnés min"
              type="number"
              value={influencerFilters.minSubscribers}
              onChange={(e) => setInfluencerFilters({ minSubscribers: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <select
                value={influencerFilters.sortBy}
                onChange={(e) => setInfluencerFilters({ sortBy: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
              >
                <option value="score">Score</option>
                <option value="name">Nom</option>
                <option value="subscribers">Abonnés</option>
                <option value="recent">Récent</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
