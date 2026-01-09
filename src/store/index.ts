import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GamesSlice, createGamesSlice } from './slices/gamesSlice';
import { InfluencersSlice, createInfluencersSlice } from './slices/influencersSlice';
import { UISlice, createUISlice } from './slices/uiSlice';

export type StoreState = GamesSlice & InfluencersSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createGamesSlice(...a),
      ...createInfluencersSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'boardinfluence-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        games: state.games,
        influencers: state.influencers,
      }),
    }
  )
);

// Export individual slices for cleaner imports
export { useStore as useAppStore };
