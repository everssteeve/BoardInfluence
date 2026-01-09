import { useEffect } from 'react';
import { useStore } from '@/store';
import { storageService } from '@/services/storage/LocalStorageService';

export function App() {
  const { setGames, setInfluencers, setShowOnboarding } = useStore();

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

  return (
    <div className="min-h-screen">
      <header className="card mx-4 my-6 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎲</div>
            <div>
              <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BoardInfluence
              </h1>
              <p className="text-sm text-text-medium font-mono">v3.0.0 - Architecture Modulaire</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">🚀 Projet Initialisé !</h2>
          <p className="text-text-medium mb-4">
            L'architecture modulaire professionnelle de BoardInfluence est prête.
          </p>
          <p className="text-text-medium">
            Les composants, le store, les services et toute la structure sont en place.
          </p>
        </div>
      </main>
    </div>
  );
}
