import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  ExternalLink,
  Calendar,
  FileText,
  Video,
  Eye,
  Activity
} from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { YoutubeSyncButton } from '../../components/common/YoutubeSyncButton';
import { formatCurrency } from '../../utils/formatters/numberFormatter';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { calculateInfluenceScore } from '../../utils/helpers/scoreHelpers';
import { syncInfluencerYoutubeMetrics } from '../../services/youtube/youtubeSyncService';
import { extractChannelId } from '../../services/youtube/youtubeService';

const platformColors: Record<string, string> = {
  YouTube: 'bg-red-500',
  Twitch: 'bg-purple-500',
  Blog: 'bg-orange-500',
  Instagram: 'bg-pink-500',
  TikTok: 'bg-blue-500',
  Podcast: 'bg-green-500',
  Other: 'bg-gray-500'
};

const availabilityColors: Record<string, string> = {
  'Disponible': 'bg-green-500',
  'Saturé': 'bg-yellow-500',
  'Ne répond plus': 'bg-red-500'
};

const availabilityLabels: Record<string, string> = {
  'Disponible': 'Available',
  'Saturé': 'Busy',
  'Ne répond plus': 'Unavailable'
};

export const InfluencerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const influencers = useStore(state => state.influencers);
  const campaigns = useStore(state => state.campaigns);
  const games = useStore(state => state.games);
  const updateInfluencer = useStore(state => state.updateInfluencer);

  const influencer = influencers.find(i => i.id === id);

  const relatedCampaigns = influencer
    ? campaigns.filter(c => c.influencerIds.includes(influencer.id))
    : [];

  if (!influencer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Influencer Not Found</h2>
          <p className="text-gray-400 mb-6">The influencer you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/influencers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Influencers
          </Button>
        </Card>
      </div>
    );
  }

  const score = calculateInfluenceScore(influencer);
  const completedCampaigns = relatedCampaigns.filter(c => c.status === 'completed').length;
  const activeCampaigns = relatedCampaigns.filter(c => c.status === 'in_progress').length;

  // Handle YouTube sync
  const handleYoutubeSync = async () => {
    if (!influencer.youtubeChannelId && influencer.url) {
      const channelId = extractChannelId(influencer.url);
      if (channelId) {
        updateInfluencer(influencer.id, { youtubeChannelId: channelId });
      }
    }

    const updated = await syncInfluencerYoutubeMetrics(influencer);
    if (updated) {
      updateInfluencer(influencer.id, {
        youtubeMetrics: updated.youtubeMetrics,
        lastYoutubeSync: updated.lastYoutubeSync,
      });
    }
  };

  // Use YouTube metrics when available
  const subscribers = influencer.youtubeMetrics?.subscriberCount ?? influencer.subscribers;
  const engagementRate = influencer.youtubeMetrics?.engagementRate;
  const videoCount = influencer.youtubeMetrics?.videoCount;
  const averageViews = influencer.youtubeMetrics?.averageViews;
  const hasYoutubeMetrics = !!influencer.youtubeMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/influencers')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{influencer.name}</h1>
            <p className="text-gray-400 mt-1">
              Last updated {formatDate(influencer.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Badge className={`${platformColors[influencer.platform]} text-white`}>
            {influencer.platform}
          </Badge>
          <Badge className={`${availabilityColors[influencer.availability]} text-white`}>
            {availabilityLabels[influencer.availability]}
          </Badge>
        </div>
      </div>

      {/* YouTube Sync Button */}
      {influencer.platform === 'YouTube' && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Video className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Métriques YouTube</p>
                <p className="text-sm text-gray-400">
                  {hasYoutubeMetrics
                    ? 'Données synchronisées depuis YouTube'
                    : 'Synchronisez pour récupérer les données YouTube'}
                </p>
              </div>
            </div>
            <YoutubeSyncButton
              onSync={handleYoutubeSync}
              lastSyncDate={influencer.lastYoutubeSync}
              size="sm"
            />
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Abonnés</p>
              <p className="text-2xl font-bold">{subscribers.toLocaleString()}</p>
              {hasYoutubeMetrics && <p className="text-xs text-green-400">Via YouTube API</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Engagement</p>
              {engagementRate !== undefined ? (
                <>
                  <p className="text-2xl font-bold">{engagementRate.toFixed(2)}%</p>
                  <p className="text-xs text-gray-400">10 dernières vidéos</p>
                </>
              ) : (
                <p className="text-2xl font-bold">{influencer.engagement}/10</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Video className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Consistance</p>
              {videoCount !== undefined ? (
                <>
                  <p className="text-2xl font-bold">{videoCount}</p>
                  <p className="text-xs text-gray-400">vidéos publiées</p>
                </>
              ) : (
                <p className="text-2xl font-bold">-</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Vues moyennes</p>
              {averageViews !== undefined ? (
                <>
                  <p className="text-2xl font-bold">{averageViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">par vidéo</p>
                </>
              ) : (
                <p className="text-2xl font-bold">-</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              {influencer.url && (
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Channel URL
                  </p>
                  <a
                    href={influencer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {influencer.url}
                  </a>
                </div>
              )}

              {influencer.location && (
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </p>
                  <p className="font-medium">{influencer.location}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Taux d'engagement</p>
                  {engagementRate !== undefined ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(engagementRate * 10, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold">{engagementRate.toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${influencer.engagement * 10}%` }}
                        />
                      </div>
                      <span className="font-bold">{influencer.engagement}/10</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Content Quality</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${influencer.quality * 20}%` }}
                      />
                    </div>
                    <span className="font-bold">{influencer.quality}/5</span>
                  </div>
                </div>
              </div>

              {influencer.specialties && influencer.specialties.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {influencer.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pricing
                </p>
                <p className="font-medium text-lg">{influencer.pricing}</p>
                {influencer.pricingNotes && (
                  <p className="text-sm text-gray-400 mt-1">{influencer.pricingNotes}</p>
                )}
              </div>

              {influencer.notes && (
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </p>
                  <p className="text-gray-300">{influencer.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Campaign History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Campaign History</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold">{relatedCampaigns.length}</p>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-yellow-500">{activeCampaigns}</p>
              </div>
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-500">{completedCampaigns}</p>
              </div>
            </div>

            <div className="space-y-3">
              {relatedCampaigns.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No campaign history</p>
              ) : (
                relatedCampaigns.map(campaign => {
                  const game = games.find(g => g.id === campaign.gameId);
                  const statusColor =
                    campaign.status === 'completed'
                      ? 'bg-green-500'
                      : campaign.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500';

                  return (
                    <div
                      key={campaign.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{campaign.name}</h3>
                          {game && <p className="text-sm text-gray-400">{game.name}</p>}
                        </div>
                        <Badge className={`${statusColor} text-white text-xs`}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(campaign.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{formatCurrency(campaign.budget)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Stats & Insights */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Influence Score</span>
                  <span className="font-bold">{score.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {hasYoutubeMetrics && (
                <>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Taux d'engagement réel</p>
                    <p className="text-xl font-bold">{engagementRate?.toFixed(2)}%</p>
                    <p className="text-xs text-gray-500">Basé sur 10 dernières vidéos</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Vues moyennes par vidéo</p>
                    <p className="text-xl font-bold">{averageViews?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Sur {videoCount} vidéos</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm text-gray-400 mb-2">Reach Estimate</p>
                <p className="text-xl font-bold">
                  {engagementRate !== undefined
                    ? (subscribers * (engagementRate / 100)).toLocaleString()
                    : (influencer.subscribers * (influencer.engagement / 10)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Based on engagement rate</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Campaign Success Rate</p>
                <p className="text-xl font-bold">
                  {relatedCampaigns.length > 0
                    ? ((completedCampaigns / relatedCampaigns.length) * 100).toFixed(0)
                    : '0'}
                  %
                </p>
                <p className="text-xs text-gray-500">
                  {completedCampaigns} of {relatedCampaigns.length} campaigns
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform</span>
                <span className="font-bold">{influencer.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Abonnés</span>
                <span className="font-bold">{subscribers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Engagement</span>
                <span className="font-bold">
                  {engagementRate !== undefined ? `${engagementRate.toFixed(2)}%` : `${influencer.engagement}/10`}
                </span>
              </div>
              {videoCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Vidéos publiées</span>
                  <span className="font-bold">{videoCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Quality</span>
                <span className="font-bold">{influencer.quality}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Availability</span>
                <Badge className={`${availabilityColors[influencer.availability]} text-white text-xs`}>
                  {availabilityLabels[influencer.availability]}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Contact */}
          {(influencer.url || influencer.location) && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {influencer.url && (
                  <a
                    href={influencer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Visit Channel</span>
                  </a>
                )}
                {influencer.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{influencer.location}</span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
