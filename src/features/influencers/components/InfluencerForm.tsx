import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Influencer, InfluencerFormData, Specialty } from '@/types/models/Influencer';
import { useStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORMS } from '@/utils/constants/platforms';
import { SPECIALTIES } from '@/utils/constants/specialties';
import { PRICING_OPTIONS } from '@/utils/constants/pricing';
import { AVAILABILITY_OPTIONS } from '@/utils/constants/availability';
import { influencersDB } from '@/services/database/supabaseService';

interface InfluencerFormProps {
  isOpen: boolean;
  onClose: () => void;
  influencer?: Influencer | null;
}

export function InfluencerForm({ isOpen, onClose, influencer }: InfluencerFormProps) {
  const { addInfluencer, updateInfluencer, showAlert } = useStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState<InfluencerFormData>({
    name: '',
    platform: 'YouTube',
    url: '',
    notes: '',
    subscribers: 0,
    engagement: 5,
    quality: 3,
    specialties: [],
    location: '',
    pricing: 'Non communiqué',
    pricingNotes: '',
    availability: 'Disponible',
  });

  useEffect(() => {
    if (influencer) {
      setFormData({
        name: influencer.name,
        platform: influencer.platform,
        url: influencer.url,
        notes: influencer.notes,
        subscribers: influencer.subscribers,
        engagement: influencer.engagement,
        quality: influencer.quality,
        specialties: influencer.specialties,
        location: influencer.location,
        pricing: influencer.pricing,
        pricingNotes: influencer.pricingNotes,
        availability: influencer.availability,
      });
    } else {
      setFormData({
        name: '',
        platform: 'YouTube',
        url: '',
        notes: '',
        subscribers: 0,
        engagement: 5,
        quality: 3,
        specialties: [],
        location: '',
        pricing: 'Non communiqué',
        pricingNotes: '',
        availability: 'Disponible',
      });
    }
  }, [influencer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert('Le nom est obligatoire', 'error');
      return;
    }

    if (!user) {
      showAlert('Vous devez être connecté pour ajouter un influenceur', 'error');
      return;
    }

    try {
      if (influencer) {
        // Update existing influencer in Supabase first
        const updatedInfluencer = await influencersDB.update(influencer.id, formData, user.id);
        // Then update local store
        updateInfluencer(influencer.id, formData);
        showAlert('Influenceur modifié avec succès !', 'success');
      } else {
        // Create new influencer in Supabase first
        const newInfluencerData = {
          ...formData,
          userId: user.id,
        };
        const createdInfluencer = await influencersDB.create(newInfluencerData, user.id);
        // Then add to local store
        addInfluencer(createdInfluencer);
        showAlert('Influenceur ajouté avec succès !', 'success');
      }

      onClose();
    } catch (error) {
      console.error('Error saving influencer:', error);
      showAlert('Erreur lors de la sauvegarde de l\'influenceur. Veuillez réessayer.', 'error');
    }
  };

  const handleSpecialtyToggle = (specialty: Specialty) => {
    const specialties = formData.specialties.includes(specialty)
      ? formData.specialties.filter((s) => s !== specialty)
      : [...formData.specialties, specialty];
    setFormData({ ...formData, specialties });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={influencer ? 'Modifier l\'influenceur' : 'Ajouter un influenceur'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nom *"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Monsieur Phal"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Plateforme *</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
              required
            >
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="URL de la chaîne/profil"
          type="url"
          value={formData.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Abonnés"
            type="number"
            value={formData.subscribers}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subscribers: parseInt(e.target.value) || 0 })}
            placeholder="10000"
          />

          <Input
            label="Localisation"
            value={formData.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ex: France"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Engagement (1-10): {formData.engagement}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.engagement}
            onChange={(e) => setFormData({ ...formData, engagement: parseInt(e.target.value) })}
            className="w-full h-2 bg-surface-darker rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Qualité (1-5): {formData.quality}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.quality}
            onChange={(e) => setFormData({ ...formData, quality: parseInt(e.target.value) })}
            className="w-full h-2 bg-surface-darker rounded-lg appearance-none cursor-pointer accent-accent"
          />
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
                  formData.specialties.includes(specialty)
                    ? 'bg-primary text-white'
                    : 'bg-surface-darker text-text-medium hover:bg-surface'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tarification</label>
            <select
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
            >
              {PRICING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disponibilité</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors"
            >
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes sur la tarification</label>
          <textarea
            value={formData.pricingNotes}
            onChange={(e) => setFormData({ ...formData, pricingNotes: e.target.value })}
            placeholder="Ex: Tarif dégressif pour plusieurs vidéos"
            rows={2}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes générales</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes, commentaires, historique..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-surface-darker focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4 sticky bottom-0 bg-surface-card">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {influencer ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
