import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useStore } from '@/store';
import { importService } from '@/services/import/ImportService';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { setGames, setInfluencers, showAlert } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const data = await importService.importFromJSON(file);
      const validationErrors = importService.validateImportData(data);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Import data
      setGames(data.games);
      setInfluencers(data.influencers);

      showAlert(
        `Import réussi ! ${data.games.length} jeu(x) et ${data.influencers.length} influenceur(s) importé(s)`,
        'success'
      );
      onClose();
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setErrors([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importer des données"
    >
      <div className="space-y-4">
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            Important
          </h4>
          <p className="text-sm text-text-medium">
            L'import remplacera toutes vos données actuelles. Pensez à faire une sauvegarde avant.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fichier JSON à importer
          </label>
          <div className="border-2 border-dashed border-surface-darker rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-3 text-text-medium" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer"
            >
              <Button
                variant="secondary"
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? 'Import en cours...' : 'Choisir un fichier'}
              </Button>
            </label>
            <p className="text-sm text-text-medium mt-2">
              Format JSON uniquement
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-danger">
              <AlertTriangle className="w-5 h-5" />
              Erreurs détectées
            </h4>
            <ul className="space-y-1 text-sm">
              {errors.map((error, index) => (
                <li key={index} className="text-text-medium">
                  • {error}
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="mt-3"
            >
              Réessayer
            </Button>
          </div>
        )}

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            Format attendu
          </h4>
          <pre className="text-xs bg-surface p-3 rounded overflow-x-auto">
{`{
  "version": "3.0.0",
  "exportDate": "2024-01-01",
  "games": [...],
  "influencers": [...]
}`}
          </pre>
        </div>
      </div>
    </Modal>
  );
}
