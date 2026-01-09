import { Specialty } from '@/types/models/Influencer';

export const SPECIALTIES: Specialty[] = [
  'Famille',
  'Expert',
  'Stratégie',
  'Party Game',
  'Coopératif',
  'Ambiance',
  'Deckbuilding',
  'Legacy',
  '2 Joueurs',
  'Enfants',
  'Abstrait',
  'Narratif',
];

export const SPECIALTY_COLORS: Record<Specialty, string> = {
  Famille: 'bg-green-500/20 text-green-500 border-green-500',
  Expert: 'bg-blue-500/20 text-blue-500 border-blue-500',
  Stratégie: 'bg-purple-500/20 text-purple-500 border-purple-500',
  'Party Game': 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
  Coopératif: 'bg-orange-500/20 text-orange-500 border-orange-500',
  Ambiance: 'bg-red-500/20 text-red-500 border-red-500',
  Deckbuilding: 'bg-gray-500/20 text-gray-400 border-gray-400',
  Legacy: 'bg-amber-700/20 text-amber-600 border-amber-600',
  '2 Joueurs': 'bg-cyan-500/20 text-cyan-500 border-cyan-500',
  Enfants: 'bg-pink-500/20 text-pink-500 border-pink-500',
  Abstrait: 'bg-gray-400/20 text-gray-300 border-gray-300',
  Narratif: 'bg-[#D2B48C]/20 text-[#D2B48C] border-[#D2B48C]',
};
