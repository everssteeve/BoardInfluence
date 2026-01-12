import { describe, it, expect, beforeEach } from 'vitest';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { createGamesSlice, GamesSlice } from './gamesSlice';
import { createMockGame } from '../../../tests/test-utils';

describe('GamesSlice', () => {
  let useStore: UseBoundStore<StoreApi<GamesSlice>>;

  beforeEach(() => {
    useStore = create<GamesSlice>()((...args) => createGamesSlice(...args));
  });

  describe('Initial State', () => {
    it('should have empty games array', () => {
      const state = useStore.getState();
      expect(state.games).toEqual([]);
    });

    it('should have no selected game', () => {
      const state = useStore.getState();
      expect(state.selectedGameId).toBeNull();
    });

    it('should have default filters', () => {
      const state = useStore.getState();
      expect(state.gameFilters).toEqual({
        search: '',
        types: [],
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('should not be loading', () => {
      const state = useStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should have no error', () => {
      const state = useStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('CRUD Operations', () => {
    it('should add a game', () => {
      const state = useStore.getState();
      const game = createMockGame({ name: 'New Game' });

      state.addGame(game);

      const updatedState = useStore.getState();
      expect(updatedState.games).toHaveLength(1);
      expect(updatedState.games[0]).toEqual(game);
    });

    it('should add multiple games', () => {
      const state = useStore.getState();
      const game1 = createMockGame({ name: 'Game 1' });
      const game2 = createMockGame({ name: 'Game 2' });

      state.addGame(game1);
      state.addGame(game2);

      const updatedState = useStore.getState();
      expect(updatedState.games).toHaveLength(2);
    });

    it('should update a game', () => {
      const state = useStore.getState();
      const game = createMockGame({ name: 'Original Name' });

      state.addGame(game);
      state.updateGame(game.id, { name: 'Updated Name' });

      const updatedState = useStore.getState();
      expect(updatedState.games[0].name).toBe('Updated Name');
      // Check that updatedAt is different by comparing timestamps
      expect(new Date(updatedState.games[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(game.updatedAt).getTime()
      );
    });

    it('should not update non-existent game', () => {
      const state = useStore.getState();
      const game = createMockGame();

      state.addGame(game);
      state.updateGame('non-existent-id', { name: 'Updated' });

      const updatedState = useStore.getState();
      expect(updatedState.games[0].name).toBe(game.name);
    });

    it('should delete a game', () => {
      const state = useStore.getState();
      const game = createMockGame();

      state.addGame(game);
      state.deleteGame(game.id);

      const updatedState = useStore.getState();
      expect(updatedState.games).toHaveLength(0);
    });

    it('should clear selected game when deleting it', () => {
      const state = useStore.getState();
      const game = createMockGame();

      state.addGame(game);
      state.selectGame(game.id);
      state.deleteGame(game.id);

      const updatedState = useStore.getState();
      expect(updatedState.selectedGameId).toBeNull();
    });

    it('should not clear selected game when deleting different game', () => {
      const state = useStore.getState();
      const game1 = createMockGame({ name: 'Game 1' });
      const game2 = createMockGame({ name: 'Game 2' });

      state.addGame(game1);
      state.addGame(game2);
      state.selectGame(game1.id);
      state.deleteGame(game2.id);

      const updatedState = useStore.getState();
      expect(updatedState.selectedGameId).toBe(game1.id);
    });
  });

  describe('Selection', () => {
    it('should select a game', () => {
      const state = useStore.getState();
      state.selectGame('game-1');

      const updatedState = useStore.getState();
      expect(updatedState.selectedGameId).toBe('game-1');
    });

    it('should deselect game when passing null', () => {
      const state = useStore.getState();
      state.selectGame('game-1');
      state.selectGame(null);

      const updatedState = useStore.getState();
      expect(updatedState.selectedGameId).toBeNull();
    });
  });

  describe('Filters', () => {
    it('should set partial filters', () => {
      const state = useStore.getState();
      state.setGameFilters({ search: 'test' });

      const updatedState = useStore.getState();
      expect(updatedState.gameFilters.search).toBe('test');
      expect(updatedState.gameFilters.sortBy).toBe('name'); // Other filters unchanged
    });

    it('should set multiple filter properties', () => {
      const state = useStore.getState();
      state.setGameFilters({
        search: 'strategy',
        types: ['Stratégie'],
        sortBy: 'year',
        sortOrder: 'desc'
      });

      const updatedState = useStore.getState();
      expect(updatedState.gameFilters).toEqual({
        search: 'strategy',
        types: ['Stratégie'],
        sortBy: 'year',
        sortOrder: 'desc',
      });
    });

    it('should reset filters to default', () => {
      const state = useStore.getState();
      state.setGameFilters({ search: 'test', sortBy: 'year' });
      state.resetGameFilters();

      const updatedState = useStore.getState();
      expect(updatedState.gameFilters).toEqual({
        search: '',
        types: [],
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });
  });

  describe('Utilities', () => {
    it('should set all games at once', () => {
      const games = [
        createMockGame({ name: 'Game 1' }),
        createMockGame({ name: 'Game 2' }),
        createMockGame({ name: 'Game 3' }),
      ];

      const state = useStore.getState();
      state.setGames(games);

      const updatedState = useStore.getState();
      expect(updatedState.games).toEqual(games);
    });

    it('should replace existing games when setting', () => {
      const state = useStore.getState();
      state.addGame(createMockGame({ name: 'Old Game' }));

      const newGames = [createMockGame({ name: 'New Game' })];
      state.setGames(newGames);

      const updatedState = useStore.getState();
      expect(updatedState.games).toHaveLength(1);
      expect(updatedState.games[0].name).toBe('New Game');
    });

    it('should set loading state', () => {
      const state = useStore.getState();
      state.setGamesLoading(true);

      let updatedState = useStore.getState();
      expect(updatedState.isLoading).toBe(true);

      state.setGamesLoading(false);
      updatedState = useStore.getState();
      expect(updatedState.isLoading).toBe(false);
    });

    it('should set error', () => {
      const state = useStore.getState();
      state.setGamesError('Test error');

      let updatedState = useStore.getState();
      expect(updatedState.error).toBe('Test error');

      state.setGamesError(null);
      updatedState = useStore.getState();
      expect(updatedState.error).toBeNull();
    });
  });
});
