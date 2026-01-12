import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/common/Card';
import { useStore } from '../../../store';
import { startOfMonth, format, subMonths } from 'date-fns';
import { formatCurrency } from '../../../utils/formatters/numberFormatter';

export const MonthlyBudgetChart: React.FC = () => {
  const campaigns = useStore(state => state.campaigns);

  const budgetData = useMemo(() => {
    // Get the last 6 months
    const months: Date[] = [];
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(new Date(), i));
    }

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      // Calculate budget by status for campaigns starting in this month
      const monthCampaigns = campaigns.filter(c => {
        const startDate = new Date(c.startDate);
        return startDate >= monthStart && startDate <= monthEnd;
      });

      const planned = monthCampaigns
        .filter(c => c.status === 'planned')
        .reduce((sum, c) => sum + c.budget, 0);

      const inProgress = monthCampaigns
        .filter(c => c.status === 'in_progress')
        .reduce((sum, c) => sum + c.budget, 0);

      const completed = monthCampaigns
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + c.budget, 0);

      return {
        month: format(month, 'MMM yyyy'),
        Planned: planned,
        'In Progress': inProgress,
        Completed: completed
      };
    });
  }, [campaigns]);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Monthly Budget by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={budgetData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            formatter={(value) => (value !== undefined ? formatCurrency(Number(value)) : '')}
          />
          <Legend />
          <Bar dataKey="Planned" fill="#3B82F6" />
          <Bar dataKey="In Progress" fill="#F7B801" />
          <Bar dataKey="Completed" fill="#06D6A0" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
