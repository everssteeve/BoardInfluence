import { StateCreator } from 'zustand';
import { Campaign, CampaignFilters, Deliverable } from '@/types/models/Campaign';

export interface CampaignsState {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  campaignFilters: CampaignFilters;
  isLoading: boolean;
  error: string | null;
}

export interface CampaignsActions {
  // CRUD
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;

  // Deliverables
  addDeliverable: (campaignId: string, deliverable: Deliverable) => void;
  updateDeliverable: (campaignId: string, deliverableId: string, data: Partial<Deliverable>) => void;
  deleteDeliverable: (campaignId: string, deliverableId: string) => void;

  // Filters
  setCampaignFilters: (filters: Partial<CampaignFilters>) => void;
  resetCampaignFilters: () => void;

  // Utils
  setCampaigns: (campaigns: Campaign[]) => void;
  setCampaignsLoading: (loading: boolean) => void;
  setCampaignsError: (error: string | null) => void;
}

export type CampaignsSlice = CampaignsState & CampaignsActions;

const DEFAULT_FILTERS: CampaignFilters = {
  search: '',
  status: [],
  gameId: null,
  sortBy: 'startDate',
  sortOrder: 'desc',
};

export const createCampaignsSlice: StateCreator<CampaignsSlice> = (set) => ({
  // Initial state
  campaigns: [],
  selectedCampaignId: null,
  campaignFilters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,

  // Actions
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),

  updateCampaign: (id, data) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, ...data, updatedAt: new Date().toISOString() } : campaign
      ),
    })),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
      selectedCampaignId: state.selectedCampaignId === id ? null : state.selectedCampaignId,
    })),

  selectCampaign: (id) =>
    set({ selectedCampaignId: id }),

  // Deliverables
  addDeliverable: (campaignId, deliverable) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              deliverables: [...campaign.deliverables, deliverable],
              updatedAt: new Date().toISOString(),
            }
          : campaign
      ),
    })),

  updateDeliverable: (campaignId, deliverableId, data) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              deliverables: campaign.deliverables.map((d) =>
                d.id === deliverableId ? { ...d, ...data } : d
              ),
              updatedAt: new Date().toISOString(),
            }
          : campaign
      ),
    })),

  deleteDeliverable: (campaignId, deliverableId) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              deliverables: campaign.deliverables.filter((d) => d.id !== deliverableId),
              updatedAt: new Date().toISOString(),
            }
          : campaign
      ),
    })),

  setCampaignFilters: (filters) =>
    set((state) => ({
      campaignFilters: { ...state.campaignFilters, ...filters },
    })),

  resetCampaignFilters: () =>
    set({ campaignFilters: DEFAULT_FILTERS }),

  setCampaigns: (campaigns) =>
    set({ campaigns }),

  setCampaignsLoading: (loading) =>
    set({ isLoading: loading }),

  setCampaignsError: (error) =>
    set({ error }),
});
