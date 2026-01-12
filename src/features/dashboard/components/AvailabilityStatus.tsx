import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/common/Card/Card';
import { Influencer } from '@/types/models/Influencer';

interface AvailabilityStatusProps {
  influencers: Influencer[];
}

const COLORS = {
  'Disponible': '#06D6A0',
  'Saturé': '#F7B801',
  'Ne répond plus': '#EF476F',
};

export function AvailabilityStatus({ influencers }: AvailabilityStatusProps) {
  const data = useMemo(() => {
    const availabilityCounts = influencers.reduce((acc, inf) => {
      acc[inf.availability] = (acc[inf.availability] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(availabilityCounts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / influencers.length) * 100).toFixed(1),
    }));
  }, [influencers]);

  if (influencers.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Disponibilité des Influenceurs</h3>
        <p className="text-gray-500 text-center py-8">Aucun influenceur pour afficher les statistiques</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Disponibilité des Influenceurs</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.name} (${entry.percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} influenceurs`, '']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
