import { Card } from '@/components/common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Campaign } from '@/types/models/Campaign';

interface DeliverableCompletionProps {
  campaigns: Campaign[];
}

const COLORS = {
  completed: '#06D6A0',
  pending: '#F7B801',
};

export function DeliverableCompletion({ campaigns }: DeliverableCompletionProps) {
  const stats = campaigns.reduce(
    (acc, campaign) => {
      campaign.deliverables.forEach((deliverable) => {
        if (deliverable.completed) {
          acc.completed++;
        } else {
          acc.pending++;
        }
      });
      return acc;
    },
    { completed: 0, pending: 0 }
  );

  const data = [
    { name: 'Terminés', value: stats.completed },
    { name: 'En attente', value: stats.pending },
  ];

  const total = stats.completed + stats.pending;
  const completionRate = total > 0 ? ((stats.completed / total) * 100).toFixed(1) : 0;

  if (total === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Livrables - Complétion</h2>
        <div className="flex items-center justify-center h-64 text-text-medium">
          Aucun livrable disponible
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Livrables - Complétion</h2>
      <div className="mb-2 text-sm text-text-medium">
        Taux de complétion: <span className="font-bold text-success">{completionRate}%</span>
        <span className="ml-2">({stats.completed}/{total})</span>
      </div>
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
            <Cell fill={COLORS.completed} />
            <Cell fill={COLORS.pending} />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
