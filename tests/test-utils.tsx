import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * Helper to create mock game data
 */
export function createMockGame(overrides = {}) {
  return {
    id: `game-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    name: 'Test Game',
    editor: 'Test Editor',
    year: '2024',
    players: '2-4',
    duration: '60',
    type: 'Stratégie',
    releaseDate: '2024-01-15',
    source: 'manual' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create mock influencer data
 */
export function createMockInfluencer(overrides = {}) {
  return {
    id: `influencer-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    name: 'Test Influencer',
    platform: 'YouTube' as const,
    url: 'https://youtube.com/test',
    notes: 'Test notes',
    subscribers: 10000,
    engagement: 7,
    quality: 4,
    specialties: ['Stratégie' as const],
    location: 'Paris, France',
    pricing: '500 - 1000€' as const,
    pricingNotes: '',
    availability: 'Disponible' as const,
    games: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create mock campaign data
 */
export function createMockCampaign(overrides = {}) {
  return {
    id: `campaign-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    name: 'Test Campaign',
    gameId: 'game-1',
    influencerIds: ['influencer-1'],
    status: 'planned' as const,
    budget: 5000,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    objectives: 'Test objectives',
    deliverables: [],
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
