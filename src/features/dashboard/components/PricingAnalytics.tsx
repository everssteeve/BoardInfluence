import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/common/Card/Card';
import { Influencer } from '@/types/models/Influencer';

interface PricingAnalyticsProps {
  influencers: Influencer[];
}

export function PricingAnalytics({ influencers }: PricingAnalyticsProps) {
  const data = useMemo(() => {
    const pricingCounts = influencers.reduce((acc, inf) => {
      acc[inf.pricing] = (acc[inf.pricing] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Define pricing order
    const pricingOrder = [
      'Non communiqué',
      'Gratuit',
      '100 - 500€',
      '500 - 1000€',
      '1000 - 2000€',
      '2000€+',
      'À négocier',
    ];

    return pricingOrder
      .map((pricing) => ({
        name: pricing,
        count: pricingCounts[pricing] || 0,
        percentage: influencers.length > 0 ? (((pricingCounts[pricing] || 0) / influencers.length) * 100).toFixed(1) : 0,
      }))
      .filter((item) => item.count > 0);
  }, [influencers]);

  if (influencers.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution des Prix</h3>
        <p className="text-gray-500 text-center py-8">Aucun influenceur pour afficher les statistiques</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Distribution des Prix</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} fontSize={12} />
          <Tooltip
            formatter={(value) => [`${value} influenceurs`, '']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <Legend />
          <Bar dataKey="count" fill="#F7B801" name="Nombre d'influenceurs" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
