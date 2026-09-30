import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Users, ReceiptText, DollarSign, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminOverviewCards = ({ overviewData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  const summary = overviewData?.summary || {
    totalUsers: 0,
    totalTransactions: 0,
    totalSystemVolume: 0,
    totalIncomeVolume: 0,
  };

  const cards = [
    {
      title: 'Total Users',
      value: summary.totalUsers.toLocaleString(),
      subtext: 'Registered platform users',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Transactions',
      value: summary.totalTransactions.toLocaleString(),
      subtext: 'All user records',
      icon: ReceiptText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'System Volume',
      value: formatCurrency(summary.totalSystemVolume, 'USD'),
      subtext: 'Gross money processed',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Server Uptime',
      value: overviewData?.uptime ? `${Math.floor(overviewData.uptime / 60)} mins` : 'Online',
      subtext: 'API server status',
      icon: Activity,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="border-border/60 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.title}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold tracking-tight">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.subtext}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
