import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
import { Login, Signup, ForgotPassword, ResetPassword } from '@/features/auth';
import { UserProfile } from '@/features/profile';

function AppContent() {
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
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
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
                <Route path="/profile" element={<UserProfile />} />
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
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/BoardInfluence/">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
