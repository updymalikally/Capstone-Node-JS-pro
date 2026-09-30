import React from 'react';
import {
  BarChart,
  Bar,
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

export const IncomeExpenseBarChart = ({ totals }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const data = [
    {
      name: 'Summary',
      Income: totals?.income || 0,
      Expense: totals?.expense || 0,
      Savings: totals?.netSavings || 0,
    },
  ];

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
              <span className="text-muted-foreground">{entry.name}:</span>
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
        <CardTitle>Cash Flow Distribution</CardTitle>
        <CardDescription>Direct comparison of inflows, outflows, and net savings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Income" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Expense" fill="#F43F5E" radius={[8, 8, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Savings" fill="#6366F1" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
