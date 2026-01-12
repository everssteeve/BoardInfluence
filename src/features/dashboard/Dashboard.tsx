import { useStore } from '@/store';
import { useMemo } from 'react';
import { Gamepad2, Users, Trophy, TrendingUp } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { TopInfluencers } from './components/TopInfluencers';
import { QuickActions } from './components/QuickActions';
import { RecentActivity } from './components/RecentActivity';
import { PlatformDistribution } from './components/PlatformDistribution';
import { EngagementChart } from './components/EngagementChart';
import { PricingAnalytics } from './components/PricingAnalytics';
import { AvailabilityStatus } from './components/AvailabilityStatus';
import { CampaignStatusChart } from './components/CampaignStatusChart';
import { CampaignBudgetChart } from './components/CampaignBudgetChart';
import { DeliverableCompletion } from './components/DeliverableCompletion';
import { CampaignROIChart } from './components/CampaignROIChart';
import { TimelineChart } from './components/TimelineChart';
import { MonthlyBudgetChart } from './components/MonthlyBudgetChart';
import { calculateInfluenceScore } from '@/utils/helpers/scoreHelpers';

export function Dashboard() {
  const { games, influencers, campaigns } = useStore();

  const stats = useMemo(() => {
    const scores = influencers.map((inf) => calculateInfluenceScore(inf));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return {
      totalGames: games.length,
      totalInfluencers: influencers.length,
      avgScore,
      availableInfluencers: influencers.filter((inf) => inf.availability === 'Disponible').length,
    };
  }, [games, influencers]);

  const isEmpty = games.length === 0 && influencers.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-bold mb-2">Bienvenue sur BoardInfluence !</h2>
          <p className="text-text-medium mb-6">
            Commencez par ajouter vos premiers jeux et influenceurs
          </p>
          <QuickActions />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Jeux"
          value={stats.totalGames}
          icon={Gamepad2}
          color="primary"
        />
        <StatsCard
          title="Influenceurs"
          value={stats.totalInfluencers}
          icon={Users}
          color="secondary"
        />
        <StatsCard
          title="Score Moyen"
          value={stats.avgScore}
          icon={Trophy}
          color="accent"
        />
        <StatsCard
          title="Disponibles"
          value={stats.availableInfluencers}
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Timeline Analytics */}
      {(campaigns.length > 0 || influencers.length > 0 || games.length > 0) && (
        <>
          <h2 className="text-2xl font-bold">Growth & Budget Timeline</h2>
          <div className="grid grid-cols-1 gap-6">
            <TimelineChart />
            {campaigns.length > 0 && <MonthlyBudgetChart />}
          </div>
        </>
      )}

      {/* Influencer Analytics Charts */}
      {influencers.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Analytics Influenceurs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformDistribution influencers={influencers} />
            <EngagementChart influencers={influencers} />
            <PricingAnalytics influencers={influencers} />
            <AvailabilityStatus influencers={influencers} />
          </div>
        </>
      )}

      {/* Campaign Analytics Charts */}
      {campaigns.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-6">Analytics Campagnes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignStatusChart campaigns={campaigns} />
            <CampaignBudgetChart campaigns={campaigns} />
            <DeliverableCompletion campaigns={campaigns} />
            <CampaignROIChart campaigns={campaigns} games={games} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopInfluencers />
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
