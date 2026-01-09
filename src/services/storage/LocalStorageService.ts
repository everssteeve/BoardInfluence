import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';

const STORAGE_KEYS = {
  GAMES: 'boardinfluence_games',
  INFLUENCERS: 'boardinfluence_influencers',
  VERSION: 'boardinfluence_version',
  ONBOARDING: 'boardinfluence_onboarding_seen',
} as const;

class LocalStorageService {
  private version = '3.0.0';

  // Games
  async getGames(): Promise<Game[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading games:', error);
      return [];
    }
  }

  async saveGames(games: Game[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
      this.saveVersion();
    } catch (error) {
      console.error('Error saving games:', error);
      throw new Error('Failed to save games');
    }
  }

  // Influencers
  async getInfluencers(): Promise<Influencer[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INFLUENCERS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return this.migrateInfluencers(parsed);
    } catch (error) {
      console.error('Error loading influencers:', error);
      return [];
    }
  }

  async saveInfluencers(influencers: Influencer[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.INFLUENCERS, JSON.stringify(influencers));
      this.saveVersion();
    } catch (error) {
      console.error('Error saving influencers:', error);
      throw new Error('Failed to save influencers');
    }
  }

  // Onboarding
  hasSeenOnboarding(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  }

  markOnboardingAsSeen(): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
  }

  // Migration
  private migrateInfluencers(data: any[]): Influencer[] {
    return data.map((inf) => ({
      ...inf,
      specialties: inf.specialties || [],
      location: inf.location || '',
      pricing: inf.pricing || 'Non communiqué',
      pricingNotes: inf.pricingNotes || '',
      availability: inf.availability || 'Disponible',
      updatedAt: inf.updatedAt || inf.createdAt,
    }));
  }

  // Version
  private saveVersion(): void {
    localStorage.setItem(STORAGE_KEYS.VERSION, this.version);
  }

  getVersion(): string | null {
    return localStorage.getItem(STORAGE_KEYS.VERSION);
  }

  // Clear all
  async clearAll(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new LocalStorageService();
