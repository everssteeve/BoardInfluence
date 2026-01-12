import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useStore } from '@/store';
import { Plus, Search, Upload, Download } from 'lucide-react';
import { exportService } from '@/services/export/ExportService';

export function QuickActions() {
  const { setCurrentTab, setShowSearchModal, setShowImportModal, games, influencers, campaigns, showAlert } = useStore();

  const handleExportJSON = () => {
    try {
      exportService.exportJSON(games, influencers, campaigns);
      showAlert('Export JSON réussi !', 'success');
    } catch (error) {
      showAlert('Erreur lors de l\'export JSON', 'error');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          onClick={() => setCurrentTab('games')}
          className="flex flex-col gap-2 h-auto py-4"
        >
          <Plus className="w-6 h-6" />
          <span>Ajouter un Jeu</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setCurrentTab('influencers')}
          className="flex flex-col gap-2 h-auto py-4"
        >
          <Plus className="w-6 h-6" />
          <span>Ajouter un Influenceur</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowSearchModal(true)}
          className="flex flex-col gap-2 h-auto py-4"
        >
          <Search className="w-6 h-6" />
          <span>Rechercher</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowImportModal(true)}
          className="flex flex-col gap-2 h-auto py-4"
        >
          <Upload className="w-6 h-6" />
          <span>Importer</span>
        </Button>

        <Button
          variant="secondary"
          onClick={handleExportJSON}
          className="flex flex-col gap-2 h-auto py-4 col-span-2"
        >
          <Download className="w-6 h-6" />
          <span>Exporter les données</span>
        </Button>
      </div>
    </Card>
  );
}
