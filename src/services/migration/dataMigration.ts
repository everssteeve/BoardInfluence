import { gamesDB, influencersDB, campaignsDB } from '../database/supabaseService';
import type { Game, Influencer, Campaign } from '@/types';

interface MigrationResult {
  success: boolean;
  gamesImported: number;
  influencersImported: number;
  campaignsImported: number;
  errors: string[];
}

/**
 * Migrate data from localStorage to Supabase
 * This function takes existing data and imports it into Supabase for the current user
 */
export async function migrateLocalStorageToSupabase(
  userId: string,
  data: {
    games?: Game[];
    influencers?: Influencer[];
    campaigns?: Campaign[];
  }
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    gamesImported: 0,
    influencersImported: 0,
    campaignsImported: 0,
    errors: [],
  };

  try {
    // Migrate Games
    if (data.games && data.games.length > 0) {
      console.log(`Migrating ${data.games.length} games...`);
      for (const game of data.games) {
        try {
          await gamesDB.create(
            {
              name: game.name,
              year: game.year,
              editor: game.editor,
              players: game.players,
              duration: game.duration,
              type: game.type,
              releaseDate: game.releaseDate,
              source: game.source,
              userId: userId,
            },
            userId
          );
          result.gamesImported++;
        } catch (error) {
          result.errors.push(`Failed to import game "${game.name}": ${error}`);
          console.error(`Failed to import game "${game.name}":`, error);
        }
      }
    }

    // Migrate Influencers
    if (data.influencers && data.influencers.length > 0) {
      console.log(`Migrating ${data.influencers.length} influencers...`);
      for (const influencer of data.influencers) {
        try {
          await influencersDB.create(
            {
              name: influencer.name,
              platform: influencer.platform,
              url: influencer.url,
              notes: influencer.notes,
              subscribers: influencer.subscribers,
              engagement: influencer.engagement,
              quality: influencer.quality,
              specialties: influencer.specialties,
              location: influencer.location,
              pricing: influencer.pricing,
              pricingNotes: influencer.pricingNotes,
              availability: influencer.availability,
              userId: userId,
            },
            userId
          );
          result.influencersImported++;
        } catch (error) {
          result.errors.push(`Failed to import influencer "${influencer.name}": ${error}`);
          console.error(`Failed to import influencer "${influencer.name}":`, error);
        }
      }
    }

    // Migrate Campaigns
    if (data.campaigns && data.campaigns.length > 0) {
      console.log(`Migrating ${data.campaigns.length} campaigns...`);
      for (const campaign of data.campaigns) {
        try {
          await campaignsDB.create(
            {
              name: campaign.name,
              gameId: campaign.gameId,
              influencerIds: campaign.influencerIds,
              status: campaign.status,
              budget: campaign.budget,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
              objectives: campaign.objectives,
              deliverables: campaign.deliverables,
              notes: campaign.notes,
              userId: userId,
            },
            userId
          );
          result.campaignsImported++;
        } catch (error) {
          result.errors.push(`Failed to import campaign "${campaign.name}": ${error}`);
          console.error(`Failed to import campaign "${campaign.name}":`, error);
        }
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    console.log('Migration completed:', result);
    return result;
  } catch (error) {
    console.error('Migration failed:', error);
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
    return result;
  }
}

/**
 * Export data from localStorage format
 */
export function exportLocalStorageData(): {
  games: Game[];
  influencers: Influencer[];
  campaigns: Campaign[];
} | null {
  try {
    const stored = localStorage.getItem('boardinfluence-storage');
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);
    return {
      games: data.state?.games || [],
      influencers: data.state?.influencers || [],
      campaigns: data.state?.campaigns || [],
    };
  } catch (error) {
    console.error('Error exporting localStorage data:', error);
    return null;
  }
}

/**
 * Check if localStorage has data to migrate
 */
export function hasLocalStorageData(): boolean {
  try {
    const stored = localStorage.getItem('boardinfluence-storage');
    if (!stored) {
      return false;
    }

    const data = JSON.parse(stored);
    const games = data.state?.games || [];
    const influencers = data.state?.influencers || [];
    const campaigns = data.state?.campaigns || [];

    return games.length > 0 || influencers.length > 0 || campaigns.length > 0;
  } catch (error) {
    return false;
  }
}
