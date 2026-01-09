import { Platform } from '@/types/models/Influencer';

export const PLATFORMS: Platform[] = [
  'YouTube',
  'Twitch',
  'Blog',
  'Instagram',
  'TikTok',
  'Podcast',
];

export const PLATFORM_ICONS: Record<Platform, string> = {
  YouTube: '📱',
  Twitch: '🎮',
  Blog: '✍️',
  Instagram: '📸',
  TikTok: '🎵',
  Podcast: '🎙️',
};
