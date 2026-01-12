import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { storageService } from '@/services/storage/LocalStorageService';
import { MainLayout } from '@/components/layout';
import { Dashboard } from '@/features/dashboard';
import { Games } from '@/features/games';
import { Influencers } from '@/features/influencers';
import { Campaigns } from '@/features/campaigns/Campaigns';
import { CampaignDetail } from '@/features/campaigns/CampaignDetail';
import { InfluencerProfile } from '@/features/influencers/InfluencerProfile';
import { Reports } from '@/features/reports';
import { Onboarding } from '@/features/onboarding';
import { SearchModal } from '@/features/search';
import { ImportModal } from '@/features/import';

export function App() {
  const {
    setGames,
    setInfluencers,
    setCampaigns,
    setShowOnboarding,
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
      const campaigns = await storageService.getCampaigns();

      setGames(games);
      setInfluencers(influencers);
      setCampaigns(campaigns);

      // Show onboarding if first time
      if (!storageService.hasSeenOnboarding() && games.length === 0 && influencers.length === 0) {
        setShowOnboarding(true);
      }
    };

    loadData();
  }, [setGames, setInfluencers, setCampaigns, setShowOnboarding]);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/influencers" element={<Influencers />} />
          <Route path="/influencers/:id" element={<InfluencerProfile />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>

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
    </BrowserRouter>
  );
}
