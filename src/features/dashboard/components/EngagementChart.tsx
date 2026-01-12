import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/common/Card/Card';
import { Influencer } from '@/types/models/Influencer';

interface EngagementChartProps {
  influencers: Influencer[];
}

export function EngagementChart({ influencers }: EngagementChartProps) {
  const data = useMemo(() => {
    // Group influencers by engagement level
    const groups = {
      'Faible (1-3)': 0,
      'Moyen (4-6)': 0,
      'Bon (7-8)': 0,
      'Excellent (9-10)': 0,
    };

    influencers.forEach((inf) => {
      if (inf.engagement <= 3) groups['Faible (1-3)']++;
      else if (inf.engagement <= 6) groups['Moyen (4-6)']++;
      else if (inf.engagement <= 8) groups['Bon (7-8)']++;
      else groups['Excellent (9-10)']++;
    });

    return Object.entries(groups).map(([name, count]) => ({
      name,
      count,
      percentage: influencers.length > 0 ? ((count / influencers.length) * 100).toFixed(1) : 0,
    }));
  }, [influencers]);

  if (influencers.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Niveau d'Engagement</h3>
        <p className="text-gray-500 text-center py-8">Aucun influenceur pour afficher les statistiques</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Niveau d'Engagement</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} influenceurs`, '']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <Legend />
          <Bar dataKey="count" fill="#FF6B35" name="Nombre d'influenceurs" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
