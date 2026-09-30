import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Percent,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const SummaryCards = ({ summaryData, isLoading }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-36 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  const totals = summaryData?.totals || {
    income: 0,
    expense: 0,
    netSavings: 0,
    savingsRate: '0%',
  };

  const cards = [
    {
      title: 'Total Income',
      amount: formatCurrency(totals.income, currency),
      subtext: 'Monthly inflows',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totals.expense, currency),
      subtext: 'Monthly outflows',
      icon: TrendingDown,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Net Savings',
      amount: formatCurrency(totals.netSavings, currency),
      subtext: totals.netSavings >= 0 ? 'Surplus cashflow' : 'Deficit cashflow',
      icon: Wallet,
      color: totals.netSavings >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Savings Rate',
      amount: totals.savingsRate,
      subtext: 'Income saved',
      icon: Percent,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="relative overflow-hidden border-border/60 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-foreground">
                  {card.amount}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {card.subtext}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
