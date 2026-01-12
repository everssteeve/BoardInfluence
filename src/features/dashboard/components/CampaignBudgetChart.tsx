import { Card } from '@/components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Campaign } from '@/types/models/Campaign';

interface CampaignBudgetChartProps {
  campaigns: Campaign[];
}

export function CampaignBudgetChart({ campaigns }: CampaignBudgetChartProps) {
  // Calculate budget by status
  const budgetByStatus = campaigns.reduce(
    (acc, campaign) => {
      if (!acc[campaign.status]) {
        acc[campaign.status] = 0;
      }
      acc[campaign.status] += campaign.budget;
      return acc;
    },
    {} as Record<string, number>
  );

  const STATUS_LABELS = {
    planned: 'Planifiées',
    in_progress: 'En cours',
    completed: 'Terminées',
    cancelled: 'Annulées',
  };

  const data = Object.entries(budgetByStatus).map(([status, budget]) => ({
    status: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    budget: budget,
  }));

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

  if (campaigns.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Budget par Statut</h2>
        <div className="flex items-center justify-center h-64 text-text-medium">
          Aucune campagne disponible
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Budget par Statut</h2>
      <div className="mb-2 text-sm text-text-medium">
        Budget total: <span className="font-bold text-primary">{totalBudget.toLocaleString()}€</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="status" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number | undefined) => value ? `${value.toLocaleString()}€` : '0€'}
          />
          <Legend />
          <Bar dataKey="budget" fill="#FF6B35" name="Budget (€)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
