import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export const MonthlyTrendChart = ({ transactions = [] }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  // Group transactions by date day for current month
  const chartData = React.useMemo(() => {
    const map = {};

    transactions.forEach((tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        map[dateStr].income += tx.amount;
      } else {
        map[dateStr].expense += tx.amount;
      }
    });

    return Object.values(map);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border bg-background/95 p-3 shadow-xl backdrop-blur text-xs">
          <p className="font-semibold text-foreground mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 py-0.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-muted-foreground">
                {entry.name}:
              </span>
              <span className="font-bold text-foreground">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Cash Flow Trend</CardTitle>
        <CardDescription>Income vs Expenses over the timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
            No transaction records available for charting yet.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
