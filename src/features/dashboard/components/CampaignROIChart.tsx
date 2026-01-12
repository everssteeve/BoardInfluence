import { Card } from '@/components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Campaign } from '@/types/models/Campaign';
import { Game } from '@/types/models/Game';

interface CampaignROIChartProps {
  campaigns: Campaign[];
  games: Game[];
}

export function CampaignROIChart({ campaigns, games }: CampaignROIChartProps) {
  const gameMap = new Map(games.map((g) => [g.id, g.name]));

  // Get top 5 campaigns by budget with deliverable completion
  const campaignData = campaigns
    .map((campaign) => {
      const completedDeliverables = campaign.deliverables.filter((d) => d.completed).length;
      const totalDeliverables = campaign.deliverables.length;
      const completionRate = totalDeliverables > 0
        ? (completedDeliverables / totalDeliverables) * 100
        : 0;

      return {
        name: campaign.name.length > 20
          ? campaign.name.substring(0, 20) + '...'
          : campaign.name,
        budget: campaign.budget,
        completion: parseFloat(completionRate.toFixed(1)),
        game: gameMap.get(campaign.gameId) || 'N/A',
      };
    })
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 5);

  if (campaigns.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Top 5 Campagnes - Budget & Complétion</h2>
        <div className="flex items-center justify-center h-64 text-text-medium">
          Aucune campagne disponible
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Top 5 Campagnes - Budget & Complétion</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={campaignData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis yAxisId="left" stroke="#9CA3AF" />
          <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              if (!value) return '0';
              if (name === 'Budget') return `${value.toLocaleString()}€`;
              if (name === 'Complétion') return `${value}%`;
              return value;
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="budget" fill="#FF6B35" name="Budget (€)" />
          <Bar yAxisId="right" dataKey="completion" fill="#06D6A0" name="Complétion (%)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
