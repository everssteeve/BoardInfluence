import { supabase } from '@/lib/supabase';
import type { Game, Influencer, Campaign } from '@/types';

/**
 * Supabase Database Service
 * Handles all CRUD operations with automatic userId filtering via RLS
 */

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Ensures that a profile exists for the given user ID.
 * If the profile doesn't exist, it creates one using the auth.users data.
 * This handles cases where the auto-create trigger didn't run or users existed before the trigger was added.
 */
async function ensureProfileExists(userId: string): Promise<void> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    // If profile exists, we're done
    if (existingProfile) {
      return;
    }

    // If error is something other than "not found", throw it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for profile:', checkError);
      throw checkError;
    }

    // Profile doesn't exist, create it
    console.log('Profile not found for user', userId, '- creating one now');

    // Get user data from auth.users
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unable to get user data to create profile');
    }

    // Create the profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        company: user.user_metadata?.company || null,
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw insertError;
    }

    console.log('Profile created successfully for user', userId);
  } catch (error) {
    console.error('Error in ensureProfileExists:', error);
    throw error;
  }
}

// =====================================================
// GAMES
// =====================================================
export const gamesDB = {
  async getAll(userId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
      throw error;
    }

    return data.map(mapGameFromDB);
  },

  async getById(id: string, userId: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching game:', error);
      return null;
    }

    return mapGameFromDB(data);
  },

  async create(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Game> {
    // Ensure profile exists before creating game
    await ensureProfileExists(userId);

    const { data, error } = await supabase
      .from('games')
      .insert({
        user_id: userId,
        name: game.name,
        year: game.year,
        editor: game.editor,
        players: game.players,
        duration: game.duration,
        type: game.type,
        release_date: game.releaseDate,
        source: game.source,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      throw error;
    }

    return mapGameFromDB(data);
  },

  async update(id: string, game: Partial<Game>, userId: string): Promise<Game> {
    const updateData: any = {};
    if (game.name !== undefined) updateData.name = game.name;
    if (game.year !== undefined) updateData.year = game.year;
    if (game.editor !== undefined) updateData.editor = game.editor;
    if (game.players !== undefined) updateData.players = game.players;
    if (game.duration !== undefined) updateData.duration = game.duration;
    if (game.type !== undefined) updateData.type = game.type;
    if (game.releaseDate !== undefined) updateData.release_date = game.releaseDate;
    if (game.source !== undefined) updateData.source = game.source;

    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating game:', error);
      throw error;
    }

    return mapGameFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  },
};

// =====================================================
// INFLUENCERS
// =====================================================
export const influencersDB = {
  async getAll(userId: string): Promise<Influencer[]> {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching influencers:', error);
      throw error;
    }

    return data.map(mapInfluencerFromDB);
  },

  async getById(id: string, userId: string): Promise<Influencer | null> {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching influencer:', error);
      return null;
    }

    return mapInfluencerFromDB(data);
  },

  async create(
    influencer: Omit<Influencer, 'id' | 'createdAt' | 'updatedAt' | 'games'>,
    userId: string
  ): Promise<Influencer> {
    // Ensure profile exists before creating influencer
    await ensureProfileExists(userId);

    const { data, error } = await supabase
      .from('influencers')
      .insert({
        user_id: userId,
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
        pricing_notes: influencer.pricingNotes,
        availability: influencer.availability,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating influencer:', error);
      throw error;
    }

    return mapInfluencerFromDB(data);
  },

  async update(id: string, influencer: Partial<Influencer>, userId: string): Promise<Influencer> {
    const updateData: any = {};
    if (influencer.name !== undefined) updateData.name = influencer.name;
    if (influencer.platform !== undefined) updateData.platform = influencer.platform;
    if (influencer.url !== undefined) updateData.url = influencer.url;
    if (influencer.notes !== undefined) updateData.notes = influencer.notes;
    if (influencer.subscribers !== undefined) updateData.subscribers = influencer.subscribers;
    if (influencer.engagement !== undefined) updateData.engagement = influencer.engagement;
    if (influencer.quality !== undefined) updateData.quality = influencer.quality;
    if (influencer.specialties !== undefined) updateData.specialties = influencer.specialties;
    if (influencer.location !== undefined) updateData.location = influencer.location;
    if (influencer.pricing !== undefined) updateData.pricing = influencer.pricing;
    if (influencer.pricingNotes !== undefined) updateData.pricing_notes = influencer.pricingNotes;
    if (influencer.availability !== undefined) updateData.availability = influencer.availability;

    const { data, error } = await supabase
      .from('influencers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating influencer:', error);
      throw error;
    }

    return mapInfluencerFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting influencer:', error);
      throw error;
    }
  },
};

// =====================================================
// CAMPAIGNS
// =====================================================
export const campaignsDB = {
  async getAll(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

    return data.map(mapCampaignFromDB);
  },

  async getById(id: string, userId: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }

    return mapCampaignFromDB(data);
  },

  async create(
    campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<Campaign> {
    // Ensure profile exists before creating campaign
    await ensureProfileExists(userId);

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        name: campaign.name,
        game_id: campaign.gameId,
        influencer_ids: campaign.influencerIds,
        status: campaign.status,
        budget: campaign.budget,
        start_date: campaign.startDate,
        end_date: campaign.endDate || null,
        objectives: campaign.objectives,
        deliverables: campaign.deliverables,
        notes: campaign.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    return mapCampaignFromDB(data);
  },

  async update(id: string, campaign: Partial<Campaign>, userId: string): Promise<Campaign> {
    const updateData: any = {};
    if (campaign.name !== undefined) updateData.name = campaign.name;
    if (campaign.gameId !== undefined) updateData.game_id = campaign.gameId;
    if (campaign.influencerIds !== undefined) updateData.influencer_ids = campaign.influencerIds;
    if (campaign.status !== undefined) updateData.status = campaign.status;
    if (campaign.budget !== undefined) updateData.budget = campaign.budget;
    if (campaign.startDate !== undefined) updateData.start_date = campaign.startDate;
    if (campaign.endDate !== undefined) updateData.end_date = campaign.endDate;
    if (campaign.objectives !== undefined) updateData.objectives = campaign.objectives;
    if (campaign.deliverables !== undefined) updateData.deliverables = campaign.deliverables;
    if (campaign.notes !== undefined) updateData.notes = campaign.notes;

    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }

    return mapCampaignFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },
};

// =====================================================
// MAPPERS (DB format <-> App format)
// =====================================================
function mapGameFromDB(dbGame: any): Game {
  return {
    id: dbGame.id,
    userId: dbGame.user_id,
    name: dbGame.name,
    year: dbGame.year,
    editor: dbGame.editor,
    players: dbGame.players,
    duration: dbGame.duration,
    type: dbGame.type,
    releaseDate: dbGame.release_date,
    source: dbGame.source,
    createdAt: dbGame.created_at,
    updatedAt: dbGame.updated_at,
  };
}

function mapInfluencerFromDB(dbInfluencer: any): Influencer {
  return {
    id: dbInfluencer.id,
    userId: dbInfluencer.user_id,
    name: dbInfluencer.name,
    platform: dbInfluencer.platform,
    url: dbInfluencer.url,
    notes: dbInfluencer.notes,
    subscribers: dbInfluencer.subscribers,
    engagement: dbInfluencer.engagement,
    quality: dbInfluencer.quality,
    specialties: dbInfluencer.specialties,
    location: dbInfluencer.location,
    pricing: dbInfluencer.pricing,
    pricingNotes: dbInfluencer.pricing_notes,
    availability: dbInfluencer.availability,
    games: [], // Games relationship can be populated separately if needed
    createdAt: dbInfluencer.created_at,
    updatedAt: dbInfluencer.updated_at,
  };
}

function mapCampaignFromDB(dbCampaign: any): Campaign {
  return {
    id: dbCampaign.id,
    userId: dbCampaign.user_id,
    name: dbCampaign.name,
    gameId: dbCampaign.game_id,
    influencerIds: dbCampaign.influencer_ids,
    status: dbCampaign.status,
    budget: parseFloat(dbCampaign.budget),
    startDate: dbCampaign.start_date,
    endDate: dbCampaign.end_date,
    objectives: dbCampaign.objectives,
    deliverables: dbCampaign.deliverables,
    notes: dbCampaign.notes,
    createdAt: dbCampaign.created_at,
    updatedAt: dbCampaign.updated_at,
  };
}
