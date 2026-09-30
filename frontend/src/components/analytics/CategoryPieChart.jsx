import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const COLORS = [
  '#6366F1',
  '#EC4899',
  '#F59E0B',
  '#10B981',
  '#8B5CF6',
  '#3B82F6',
  '#14B8A6',
  '#EF4444',
  '#F97316',
  '#06B6D4',
];

export const CategoryPieChart = ({ categoryBreakdown = [] }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const data = React.useMemo(() => {
    return categoryBreakdown.map((item) => ({
      name: item.category,
      value: item.amount,
      count: item.count,
    }));
  }, [categoryBreakdown]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="rounded-xl border bg-background/95 p-3 shadow-xl backdrop-blur text-xs">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-primary font-bold mt-1">
            {formatCurrency(item.value, currency)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {item.payload.count} transaction(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Breakdown of expenses for the period</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
            No category expense breakdown available yet.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
