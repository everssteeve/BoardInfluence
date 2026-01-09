import { StateCreator } from 'zustand';
import { Game, GameFilters } from '@/types/models/Game';

export interface GamesState {
  games: Game[];
  selectedGameId: string | null;
  gameFilters: GameFilters;
  isLoading: boolean;
  error: string | null;
}

export interface GamesActions {
  // CRUD
  addGame: (game: Game) => void;
  updateGame: (id: string, data: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  selectGame: (id: string | null) => void;

  // Filters
  setGameFilters: (filters: Partial<GameFilters>) => void;
  resetGameFilters: () => void;

  // Utils
  setGames: (games: Game[]) => void;
  setGamesLoading: (loading: boolean) => void;
  setGamesError: (error: string | null) => void;
}

export type GamesSlice = GamesState & GamesActions;

const DEFAULT_FILTERS: GameFilters = {
  search: '',
  types: [],
  sortBy: 'name',
  sortOrder: 'asc',
};

export const createGamesSlice: StateCreator<GamesSlice> = (set) => ({
  // Initial state
  games: [],
  selectedGameId: null,
  gameFilters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,

  // Actions
  addGame: (game) =>
    set((state) => ({
      games: [...state.games, game],
    })),

  updateGame: (id, data) =>
    set((state) => ({
      games: state.games.map((game) =>
        game.id === id ? { ...game, ...data, updatedAt: new Date().toISOString() } : game
      ),
    })),

  deleteGame: (id) =>
    set((state) => ({
      games: state.games.filter((game) => game.id !== id),
      selectedGameId: state.selectedGameId === id ? null : state.selectedGameId,
    })),

  selectGame: (id) =>
    set({ selectedGameId: id }),

  setGameFilters: (filters) =>
    set((state) => ({
      gameFilters: { ...state.gameFilters, ...filters },
    })),

  resetGameFilters: () =>
    set({ gameFilters: DEFAULT_FILTERS }),

  setGames: (games) =>
    set({ games }),

  setGamesLoading: (loading) =>
    set({ isLoading: loading }),

  setGamesError: (error) =>
    set({ error }),
});
