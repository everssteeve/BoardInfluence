import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ReportService } from '../../services/reports';

type ReportType = 'campaign' | 'influencer' | 'budget' | null;

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [generating, setGenerating] = useState(false);

  const campaigns = useStore(state => state.campaigns);
  const games = useStore(state => state.games);
  const influencers = useStore(state => state.influencers);

  const handleGenerateReport = async (type: ReportType) => {
    if (!type) return;

    setGenerating(true);
    setSelectedReport(type);

    try {
      // Add a small delay to show the generating state
      await new Promise(resolve => setTimeout(resolve, 500));

      switch (type) {
        case 'campaign':
          ReportService.generateCampaignReport(campaigns, games, influencers);
          break;
        case 'influencer':
          ReportService.generateInfluencerReport(influencers, campaigns);
          break;
        case 'budget':
          ReportService.generateBudgetReport(campaigns, games);
          break;
      }
    } finally {
      setGenerating(false);
      setSelectedReport(null);
    }
  };

  const reportTypes = [
    {
      id: 'campaign' as const,
      title: 'Rapport de Performance des Campagnes',
      description: 'Vue d\'ensemble complète de toutes les campagnes avec statut, budget et métriques de complétion',
      icon: Target,
      color: 'bg-orange-500',
      stats: {
        label: 'Total Campagnes',
        value: campaigns.length
      }
    },
    {
      id: 'influencer' as const,
      title: 'Rapport Récapitulatif des Influenceurs',
      description: 'Analyse détaillée des influenceurs incluant scores, engagement et historique de campagnes',
      icon: Users,
      color: 'bg-blue-500',
      stats: {
        label: 'Total Influenceurs',
        value: influencers.length
      }
    },
    {
      id: 'budget' as const,
      title: 'Rapport d\'Analyse Budgétaire',
      description: 'Répartition financière par statut de campagne, jeu et allocation budgétaire globale',
      icon: DollarSign,
      color: 'bg-green-500',
      stats: {
        label: 'Budget Total',
        value: `${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}€`
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Rapports</h1>
        <p className="text-gray-400">
          Générez des rapports PDF détaillés pour les campagnes, influenceurs et analyses budgétaires
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Campagnes</p>
              <p className="text-2xl font-bold">{campaigns.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Influenceurs</p>
              <p className="text-2xl font-bold">{influencers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Budget Total</p>
              <p className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}€
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Jeux</p>
              <p className="text-2xl font-bold">{games.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-xl font-bold mb-4">Rapports Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportTypes.map(report => {
            const Icon = report.icon;
            const isGenerating = selectedReport === report.id && generating;

            return (
              <Card key={report.id} className="p-6 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 ${report.color}/20 rounded-lg`}>
                    <Icon className={`w-8 h-8 text-${report.color.replace('bg-', '')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-400">{report.description}</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
                  <p className="text-xs text-gray-400">{report.stats.label}</p>
                  <p className="text-lg font-bold">{report.stats.value}</p>
                </div>

                <Button
                  className="w-full mt-auto"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Générer PDF
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">À propos des Rapports</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong>Rapport de Campagne :</strong> Inclut les statistiques générales, les détails des campagnes avec
                statut et budget, le suivi des livrables et les taux de complétion.
              </p>
              <p>
                <strong>Rapport Influenceur :</strong> Présente les meilleurs performeurs par score d'influence,
                la répartition par plateforme, le nombre d'abonnés et la participation aux campagnes.
              </p>
              <p>
                <strong>Rapport Budgétaire :</strong> Fournit une répartition financière par statut de campagne, allocation
                budgétaire par jeu et analyse des dépenses.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
