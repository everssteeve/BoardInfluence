import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/common/Card';
import { useStore } from '../../../store';
import { startOfMonth, format, subMonths } from 'date-fns';

export const TimelineChart: React.FC = () => {
  const campaigns = useStore(state => state.campaigns);
  const influencers = useStore(state => state.influencers);
  const games = useStore(state => state.games);

  const timelineData = useMemo(() => {
    // Get the last 6 months
    const months: Date[] = [];
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(new Date(), i));
    }

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      // Count entities created up to this month
      const campaignCount = campaigns.filter(
        c => new Date(c.createdAt) <= monthEnd
      ).length;

      const influencerCount = influencers.filter(
        i => new Date(i.createdAt) <= monthEnd
      ).length;

      const gameCount = games.filter(
        g => new Date(g.createdAt) <= monthEnd
      ).length;

      // Calculate total budget for campaigns in this month
      const monthlyBudget = campaigns
        .filter(c => {
          const startDate = new Date(c.startDate);
          return startDate >= monthStart && startDate <= monthEnd;
        })
        .reduce((sum, c) => sum + c.budget, 0);

      return {
        month: format(month, 'MMM yyyy'),
        campaigns: campaignCount,
        influencers: influencerCount,
        games: gameCount,
        budget: monthlyBudget
      };
    });
  }, [campaigns, influencers, games]);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Growth Timeline (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="campaigns"
            stroke="#FF6B35"
            strokeWidth={2}
            name="Campaigns"
          />
          <Line
            type="monotone"
            dataKey="influencers"
            stroke="#004E89"
            strokeWidth={2}
            name="Influencers"
          />
          <Line
            type="monotone"
            dataKey="games"
            stroke="#06D6A0"
            strokeWidth={2}
            name="Games"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
