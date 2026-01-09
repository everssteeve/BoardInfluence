import { useEffect } from 'react';
import { useStore } from '@/store';
import { storageService } from '@/services/storage/LocalStorageService';
import { MainLayout } from '@/components/layout';
import { Dashboard } from '@/features/dashboard';
import { Games } from '@/features/games';
import { Influencers } from '@/features/influencers';
import { Onboarding } from '@/features/onboarding';
import { SearchModal } from '@/features/search';
import { ImportModal } from '@/features/import';

export function App() {
  const {
    setGames,
    setInfluencers,
    setShowOnboarding,
    currentTab,
    showOnboarding,
    showSearchModal,
    showImportModal,
    setShowSearchModal,
    setShowImportModal,
  } = useStore();

  useEffect(() => {
    // Load data from localStorage
    const loadData = async () => {
      const games = await storageService.getGames();
      const influencers = await storageService.getInfluencers();

      setGames(games);
      setInfluencers(influencers);

      // Show onboarding if first time
      if (!storageService.hasSeenOnboarding() && games.length === 0 && influencers.length === 0) {
        setShowOnboarding(true);
      }
    };

    loadData();
  }, [setGames, setInfluencers, setShowOnboarding]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'games':
        return <Games />;
      case 'influencers':
        return <Influencers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      {renderContent()}

      {/* Modals */}
      <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </MainLayout>
  );
}
