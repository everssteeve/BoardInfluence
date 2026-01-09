import { StateCreator } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  message: string;
  type: AlertType;
}

export interface UIState {
  currentTab: 'dashboard' | 'games' | 'influencers';
  showSearchModal: boolean;
  showImportModal: boolean;
  showOnboarding: boolean;
  alert: Alert | null;
}

export interface UIActions {
  setCurrentTab: (tab: UIState['currentTab']) => void;
  setShowSearchModal: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  showAlert: (message: string, type: AlertType) => void;
  clearAlert: () => void;
}

export type UISlice = UIState & UIActions;

export const createUISlice: StateCreator<UISlice> = (set) => ({
  // Initial state
  currentTab: 'dashboard',
  showSearchModal: false,
  showImportModal: false,
  showOnboarding: false,
  alert: null,

  // Actions
  setCurrentTab: (tab) =>
    set({ currentTab: tab }),

  setShowSearchModal: (show) =>
    set({ showSearchModal: show }),

  setShowImportModal: (show) =>
    set({ showImportModal: show }),

  setShowOnboarding: (show) =>
    set({ showOnboarding: show }),

  showAlert: (message, type) =>
    set({ alert: { message, type } }),

  clearAlert: () =>
    set({ alert: null }),
});
