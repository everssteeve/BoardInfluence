import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Target, Users, FileText, Download } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters/numberFormatter';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { calculateInfluenceScore } from '../../utils/helpers/scoreHelpers';
import { ReportService } from '../../services/reports';

const statusColors = {
  planned: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const statusLabels = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const deliverableIcons: Record<string, string> = {
  video: '🎥',
  stream: '📡',
  article: '📝',
  post: '📱',
  review: '⭐',
  other: '📦'
};

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const campaigns = useStore(state => state.campaigns);
  const games = useStore(state => state.games);
  const influencers = useStore(state => state.influencers);

  const campaign = campaigns.find(c => c.id === id);
  const game = campaign ? games.find(g => g.id === campaign.gameId) : undefined;
  const assignedInfluencers = campaign
    ? influencers.filter(i => campaign.influencerIds.includes(i.id))
    : [];

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Campaign Not Found</h2>
          <p className="text-gray-400 mb-6">The campaign you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Card>
      </div>
    );
  }

  const completedDeliverables = campaign.deliverables.filter(d => d.completed).length;
  const totalDeliverables = campaign.deliverables.length;
  const completionRate = totalDeliverables > 0
    ? ((completedDeliverables / totalDeliverables) * 100).toFixed(0)
    : '0';

  const handleGenerateReport = () => {
    ReportService.generateDetailedCampaignReport(campaign, game, influencers);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-gray-400 mt-1">
              Created {formatDate(campaign.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Badge className={`${statusColors[campaign.status]} text-white`}>
            {statusLabels[campaign.status]}
          </Badge>
          <Button variant="secondary" onClick={handleGenerateReport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(campaign.budget)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Influencers</p>
              <p className="text-2xl font-bold">{assignedInfluencers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Deliverables</p>
              <p className="text-2xl font-bold">
                {completedDeliverables}/{totalDeliverables}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completion</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Campaign Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Game</p>
                <p className="font-medium">{game?.name || 'Not assigned'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </p>
                  <p className="font-medium">{formatDate(campaign.startDate)}</p>
                </div>
                {campaign.endDate && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </p>
                    <p className="font-medium">{formatDate(campaign.endDate)}</p>
                  </div>
                )}
              </div>

              {campaign.objectives && (
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objectives
                  </p>
                  <p className="text-gray-300">{campaign.objectives}</p>
                </div>
              )}

              {campaign.notes && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-300">{campaign.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Deliverables */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Deliverables ({completedDeliverables}/{totalDeliverables})
            </h2>
            <div className="space-y-3">
              {campaign.deliverables.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No deliverables defined</p>
              ) : (
                campaign.deliverables.map((deliverable, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-2xl">{deliverableIcons[deliverable.type]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {deliverable.type}
                        </Badge>
                        {deliverable.completed && (
                          <Badge className="bg-green-500 text-white text-xs">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{deliverable.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Progress Bar */}
            {totalDeliverables > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Influencers */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Assigned Influencers</h2>
            <div className="space-y-3">
              {assignedInfluencers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No influencers assigned</p>
              ) : (
                assignedInfluencers.map(influencer => {
                  const score = calculateInfluenceScore(influencer);
                  return (
                    <div
                      key={influencer.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/influencers/${influencer.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white">{influencer.name}</h3>
                        <Badge className="bg-orange-500 text-white">
                          {score.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{influencer.platform}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {influencer.subscribers.toLocaleString()} subscribers
                        </span>
                        <Badge
                          variant={influencer.availability === 'Disponible' ? 'primary' : 'secondary'}
                          className="text-xs"
                        >
                          {influencer.availability}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          {assignedInfluencers.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Influencer Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Reach</span>
                  <span className="font-bold">
                    {assignedInfluencers
                      .reduce((sum, i) => sum + i.subscribers, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg. Score</span>
                  <span className="font-bold">
                    {(
                      assignedInfluencers.reduce(
                        (sum, i) => sum + calculateInfluenceScore(i),
                        0
                      ) / assignedInfluencers.length
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available</span>
                  <span className="font-bold">
                    {assignedInfluencers.filter(i => i.availability === 'Disponible').length}/
                    {assignedInfluencers.length}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
