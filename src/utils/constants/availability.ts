import { Availability } from '@/types/models/Influencer';

export const AVAILABILITY_OPTIONS: Availability[] = [
  'Disponible',
  'Saturé',
  'Ne répond plus',
];

export const AVAILABILITY_CONFIG: Record<
  Availability,
  { icon: string; color: string }
> = {
  Disponible: { icon: '✅', color: 'bg-success/20 text-success' },
  Saturé: { icon: '⚠️', color: 'bg-accent/20 text-accent' },
  'Ne répond plus': { icon: '❌', color: 'bg-danger/20 text-danger' },
};
