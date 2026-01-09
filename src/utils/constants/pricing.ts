import { Pricing } from '@/types/models/Influencer';

export const PRICING_OPTIONS: Pricing[] = [
  'Non communiqué',
  'Gratuit',
  '100 - 500€',
  '500 - 1000€',
  '1000 - 2000€',
  '2000€+',
  'À négocier',
];

export const PRICING_COLORS: Record<Pricing, string> = {
  'Non communiqué': 'bg-gray-500/20 text-gray-400',
  Gratuit: 'bg-success/20 text-success',
  '100 - 500€': 'bg-yellow-400/20 text-yellow-400',
  '500 - 1000€': 'bg-orange-500/20 text-orange-500',
  '1000 - 2000€': 'bg-red-400/20 text-red-400',
  '2000€+': 'bg-danger/20 text-danger',
  'À négocier': 'bg-secondary/20 text-secondary',
};
