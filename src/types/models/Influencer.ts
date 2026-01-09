import { Game } from './Game';

export type Platform = 'YouTube' | 'Twitch' | 'Blog' | 'Instagram' | 'TikTok' | 'Podcast';

export type Specialty =
  | 'Famille'
  | 'Expert'
  | 'Stratégie'
  | 'Party Game'
  | 'Coopératif'
  | 'Ambiance'
  | 'Deckbuilding'
  | 'Legacy'
  | '2 Joueurs'
  | 'Enfants'
  | 'Abstrait'
  | 'Narratif';

export type Pricing =
  | 'Non communiqué'
  | 'Gratuit'
  | '100 - 500€'
  | '500 - 1000€'
  | '1000 - 2000€'
  | '2000€+'
  | 'À négocier';

export type Availability = 'Disponible' | 'Saturé' | 'Ne répond plus';

export interface Influencer {
  id: string;
  name: string;
  platform: Platform;
  url: string;
  notes: string;
  subscribers: number;
  engagement: number; // 1-10
  quality: number; // 1-5
  specialties: Specialty[];
  location: string;
  pricing: Pricing;
  pricingNotes: string;
  availability: Availability;
  games: Game[];
  createdAt: string;
  updatedAt: string;
}

export type InfluencerFormData = Omit<Influencer, 'id' | 'createdAt' | 'updatedAt' | 'games'>;

export interface InfluencerFilters {
  search: string;
  platform: Platform | 'Tous';
  minSubscribers: number;
  maxSubscribers: number;
  minEngagement: number;
  minQuality: number;
  specialties: Specialty[];
  locations: string[];
  pricings: Pricing[];
  availabilities: Availability[];
  sortBy: 'score' | 'name' | 'recent' | 'subscribers';
  sortOrder: 'asc' | 'desc';
}

export interface InfluencerWithScore extends Influencer {
  score: number;
}
