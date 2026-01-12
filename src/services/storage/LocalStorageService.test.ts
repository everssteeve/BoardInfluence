import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './LocalStorageService';
import { createMockGame, createMockInfluencer } from '../../../tests/test-utils';

describe('LocalStorageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Games', () => {
    it('should return empty array when no games stored', async () => {
      const games = await storageService.getGames();
      expect(games).toEqual([]);
    });

    it('should save and retrieve games', async () => {
      const games = [
        createMockGame({ name: 'Game 1' }),
        createMockGame({ name: 'Game 2' }),
      ];

      await storageService.saveGames(games);
      const retrieved = await storageService.getGames();

      expect(retrieved).toHaveLength(2);
      expect(retrieved[0].name).toBe('Game 1');
      expect(retrieved[1].name).toBe('Game 2');
    });

    it('should overwrite existing games', async () => {
      const games1 = [createMockGame({ name: 'Game 1' })];
      const games2 = [createMockGame({ name: 'Game 2' })];

      await storageService.saveGames(games1);
      await storageService.saveGames(games2);
      const retrieved = await storageService.getGames();

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].name).toBe('Game 2');
    });

    it('should save version when saving games', async () => {
      const games = [createMockGame()];
      await storageService.saveGames(games);

      const version = storageService.getVersion();
      expect(version).toBe('3.0.0');
    });

    it('should handle corrupted game data', async () => {
      localStorage.setItem('boardinfluence_games', 'invalid json');
      const games = await storageService.getGames();
      expect(games).toEqual([]);
    });
  });

  describe('Influencers', () => {
    it('should return empty array when no influencers stored', async () => {
      const influencers = await storageService.getInfluencers();
      expect(influencers).toEqual([]);
    });

    it('should save and retrieve influencers', async () => {
      const influencers = [
        createMockInfluencer({ name: 'Influencer 1' }),
        createMockInfluencer({ name: 'Influencer 2' }),
      ];

      await storageService.saveInfluencers(influencers);
      const retrieved = await storageService.getInfluencers();

      expect(retrieved).toHaveLength(2);
      expect(retrieved[0].name).toBe('Influencer 1');
      expect(retrieved[1].name).toBe('Influencer 2');
    });

    it('should save version when saving influencers', async () => {
      const influencers = [createMockInfluencer()];
      await storageService.saveInfluencers(influencers);

      const version = storageService.getVersion();
      expect(version).toBe('3.0.0');
    });

    it('should migrate old influencer data', async () => {
      const oldInfluencer = {
        id: 'inf-1',
        name: 'Test',
        platform: 'YouTube',
        url: 'https://test.com',
        notes: '',
        subscribers: 10000,
        engagement: 7,
        quality: 4,
        createdAt: '2024-01-01T00:00:00.000Z',
        // Missing new fields
      };

      localStorage.setItem('boardinfluence_influencers', JSON.stringify([oldInfluencer]));
      const influencers = await storageService.getInfluencers();

      expect(influencers[0].specialties).toEqual([]);
      expect(influencers[0].location).toBe('');
      expect(influencers[0].pricing).toBe('Non communiqué');
      expect(influencers[0].pricingNotes).toBe('');
      expect(influencers[0].availability).toBe('Disponible');
      expect(influencers[0].updatedAt).toBe(oldInfluencer.createdAt);
    });

    it('should handle corrupted influencer data', async () => {
      localStorage.setItem('boardinfluence_influencers', 'invalid json');
      const influencers = await storageService.getInfluencers();
      expect(influencers).toEqual([]);
    });
  });

  describe('Onboarding', () => {
    it('should return false when onboarding not seen', () => {
      expect(storageService.hasSeenOnboarding()).toBe(false);
    });

    it('should mark onboarding as seen', () => {
      storageService.markOnboardingAsSeen();
      expect(storageService.hasSeenOnboarding()).toBe(true);
    });

    it('should set onboarding value', () => {
      storageService.setHasSeenOnboarding(true);
      expect(storageService.hasSeenOnboarding()).toBe(true);

      storageService.setHasSeenOnboarding(false);
      expect(storageService.hasSeenOnboarding()).toBe(false);
    });
  });

  describe('Version', () => {
    it('should return null when no version stored', () => {
      expect(storageService.getVersion()).toBeNull();
    });

    it('should return version after saving data', async () => {
      await storageService.saveGames([createMockGame()]);
      expect(storageService.getVersion()).toBe('3.0.0');
    });
  });

  describe('Clear All', () => {
    it('should clear all storage', async () => {
      // Add some data
      await storageService.saveGames([createMockGame()]);
      await storageService.saveInfluencers([createMockInfluencer()]);
      storageService.markOnboardingAsSeen();

      // Clear all
      await storageService.clearAll();

      // Verify everything is cleared
      expect(await storageService.getGames()).toEqual([]);
      expect(await storageService.getInfluencers()).toEqual([]);
      expect(storageService.hasSeenOnboarding()).toBe(false);
      expect(storageService.getVersion()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when saving games fails', async () => {
      // Mock localStorage to throw error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      const games = [createMockGame()];
      await expect(storageService.saveGames(games)).rejects.toThrow('Failed to save games');

      vi.restoreAllMocks();
    });

    it('should throw error when saving influencers fails', async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      const influencers = [createMockInfluencer()];
      await expect(storageService.saveInfluencers(influencers)).rejects.toThrow('Failed to save influencers');

      vi.restoreAllMocks();
    });
  });
});
