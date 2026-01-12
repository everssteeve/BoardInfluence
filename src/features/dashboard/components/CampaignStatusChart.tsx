import { Card } from '@/components/common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Campaign } from '@/types/models/Campaign';

interface CampaignStatusChartProps {
  campaigns: Campaign[];
}

const COLORS = {
  planned: '#F7B801',
  in_progress: '#004E89',
  completed: '#06D6A0',
  cancelled: '#EF476F',
};

const STATUS_LABELS = {
  planned: 'Planifiées',
  in_progress: 'En cours',
  completed: 'Terminées',
  cancelled: 'Annulées',
};

export function CampaignStatusChart({ campaigns }: CampaignStatusChartProps) {
  const statusCounts = campaigns.reduce(
    (acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: count,
    status,
  }));

  if (campaigns.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Distribution des Statuts</h2>
        <div className="flex items-center justify-center h-64 text-text-medium">
          Aucune campagne disponible
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Distribution des Statuts</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.status}`}
                fill={COLORS[entry.status as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
