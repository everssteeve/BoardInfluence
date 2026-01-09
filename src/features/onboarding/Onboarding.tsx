import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { storageService } from '@/services/storage/LocalStorageService';
import { Gamepad2, Users, TrendingUp, Download } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const handleComplete = () => {
    storageService.setHasSeenOnboarding(true);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleComplete}
      title="Bienvenue sur BoardInfluence ! 🎲"
      size="large"
    >
      <div className="space-y-6">
        <p className="text-text-medium text-center">
          Votre outil professionnel de gestion d'influenceurs pour jeux de société
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Gérez vos jeux</h3>
                <p className="text-sm text-text-medium">
                  Ajoutez et organisez votre catalogue de jeux de société
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-secondary/5 border border-secondary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Suivez les influenceurs</h3>
                <p className="text-sm text-text-medium">
                  Centralisez vos contacts influenceurs avec notes et tarifs
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Analysez les performances</h3>
                <p className="text-sm text-text-medium">
                  Score automatique basé sur engagement et qualité
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-success/5 border border-success/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20 text-success">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Export & Import</h3>
                <p className="text-sm text-text-medium">
                  Sauvegardez vos données en JSON ou CSV
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-darker rounded-lg p-4">
          <h4 className="font-bold mb-2">🚀 Pour commencer :</h4>
          <ol className="space-y-2 text-sm text-text-medium">
            <li>1. Ajoutez vos premiers jeux de société</li>
            <li>2. Référencez vos influenceurs favoris</li>
            <li>3. Utilisez les filtres pour organiser vos données</li>
            <li>4. Consultez le Dashboard pour une vue d'ensemble</li>
          </ol>
        </div>

        <Button
          variant="primary"
          onClick={handleComplete}
          className="w-full"
        >
          C'est parti ! 🎉
        </Button>
      </div>
    </Modal>
  );
}
