import { Download, Upload, Search } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useStore } from '@/store';
import { exportService } from '@/services/export/ExportService';

export function Header() {
  const { setShowSearchModal, setShowImportModal, games, influencers, campaigns, showAlert } = useStore();

  const handleExportJSON = () => {
    try {
      exportService.exportJSON(games, influencers, campaigns);
      showAlert('Export JSON réussi !', 'success');
    } catch (error) {
      showAlert('Erreur lors de l\'export JSON', 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      exportService.exportCSV(influencers);
      showAlert('Export CSV Influenceurs réussi !', 'success');
    } catch (error) {
      showAlert('Erreur lors de l\'export CSV', 'error');
    }
  };

  const handleExportCampaignsCSV = () => {
    try {
      exportService.exportCampaignsToCSV(campaigns, games, influencers);
      showAlert('Export CSV Campagnes réussi !', 'success');
    } catch (error) {
      showAlert('Erreur lors de l\'export CSV campagnes', 'error');
    }
  };

  return (
    <header className="card mx-4 my-6 animate-slide-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎲</div>
          <div>
            <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BoardInfluence
            </h1>
            <p className="text-sm text-text-medium font-mono">v3.0.0 - Gestion d'Influenceurs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>

          <div className="relative group">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-56 card hidden group-hover:block z-50 shadow-lg">
              <button
                onClick={handleExportJSON}
                className="w-full text-left px-4 py-2 hover:bg-surface-darker rounded transition-colors"
              >
                Export JSON (complet)
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-2 hover:bg-surface-darker rounded transition-colors"
              >
                Export CSV Influenceurs
              </button>
              <button
                onClick={handleExportCampaignsCSV}
                className="w-full text-left px-4 py-2 hover:bg-surface-darker rounded transition-colors"
              >
                Export CSV Campagnes
              </button>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </header>
  );
}
