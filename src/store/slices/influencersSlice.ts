import { StateCreator } from 'zustand';
import { Influencer, InfluencerFilters } from '@/types/models/Influencer';

export interface InfluencersState {
  influencers: Influencer[];
  selectedInfluencerId: string | null;
  influencerFilters: InfluencerFilters;
  isInfluencersLoading: boolean;
  influencersError: string | null;
}

export interface InfluencersActions {
  // CRUD
  addInfluencer: (influencer: Influencer) => void;
  updateInfluencer: (id: string, data: Partial<Influencer>) => void;
  deleteInfluencer: (id: string) => void;
  selectInfluencer: (id: string | null) => void;

  // Filters
  setInfluencerFilters: (filters: Partial<InfluencerFilters>) => void;
  resetInfluencerFilters: () => void;

  // Utils
  setInfluencers: (influencers: Influencer[]) => void;
  setInfluencersLoading: (loading: boolean) => void;
  setInfluencersError: (error: string | null) => void;
}

export type InfluencersSlice = InfluencersState & InfluencersActions;

const DEFAULT_FILTERS: InfluencerFilters = {
  search: '',
  platform: 'Tous',
  minSubscribers: 0,
  maxSubscribers: 1000000,
  minEngagement: 0,
  minQuality: 0,
  specialties: [],
  locations: [],
  pricings: [],
  availabilities: ['Disponible', 'Saturé'],
  sortBy: 'score',
  sortOrder: 'desc',
};

export const createInfluencersSlice: StateCreator<InfluencersSlice> = (set) => ({
  // Initial state
  influencers: [],
  selectedInfluencerId: null,
  influencerFilters: DEFAULT_FILTERS,
  isInfluencersLoading: false,
  influencersError: null,

  // Actions
  addInfluencer: (influencer) =>
    set((state) => ({
      influencers: [...state.influencers, influencer],
    })),

  updateInfluencer: (id, data) =>
    set((state) => ({
      influencers: state.influencers.map((inf) =>
        inf.id === id ? { ...inf, ...data, updatedAt: new Date().toISOString() } : inf
      ),
    })),

  deleteInfluencer: (id) =>
    set((state) => ({
      influencers: state.influencers.filter((inf) => inf.id !== id),
      selectedInfluencerId: state.selectedInfluencerId === id ? null : state.selectedInfluencerId,
    })),

  selectInfluencer: (id) =>
    set({ selectedInfluencerId: id }),

  setInfluencerFilters: (filters) =>
    set((state) => ({
      influencerFilters: { ...state.influencerFilters, ...filters },
    })),

  resetInfluencerFilters: () =>
    set({ influencerFilters: DEFAULT_FILTERS }),

  setInfluencers: (influencers) =>
    set({ influencers }),

  setInfluencersLoading: (loading) =>
    set({ isInfluencersLoading: loading }),

  setInfluencersError: (error) =>
    set({ influencersError: error }),
});
