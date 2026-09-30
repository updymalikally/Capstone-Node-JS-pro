import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions.api';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { IncomeExpenseBarChart } from '@/components/analytics/IncomeExpenseBarChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Calendar, PieChart } from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['monthly-summary', selectedYear, selectedMonth],
    queryFn: () => transactionsApi.getMonthlySummary(selectedYear, selectedMonth),
  });

  const expenseBreakdown = summaryData?.categoryBreakdown?.expense || [];
  const incomeBreakdown = summaryData?.categoryBreakdown?.income || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header with Month/Year Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Financial Analytics & Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deep-dive into income vs expense ratios, savings metrics, and category trends.
          </p>
        </div>

        {/* Date Selectors */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-card border rounded-xl p-1 shadow-sm">
            <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
            <Select
              value={selectedMonth.toString()}
              onValueChange={(val) => setSelectedMonth(parseInt(val, 10))}
            >
              <SelectTrigger className="border-0 shadow-none h-8 w-32 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(parseInt(val, 10))}
            >
              <SelectTrigger className="border-0 shadow-none h-8 w-24 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <SummaryCards summaryData={summaryData} isLoading={isLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseBarChart totals={summaryData?.totals} />
        <CategoryPieChart categoryBreakdown={expenseBreakdown} />
      </div>

      {/* Category Tables Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category List */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Expense by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseBreakdown.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No expense transactions recorded for this period.
              </p>
            ) : (
              <div className="space-y-3">
                {expenseBreakdown.map((item, idx) => {
                  const percentage = summaryData?.totals?.expense
                    ? ((item.amount / summaryData.totals.expense) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {item.category}
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(item.amount, currency)} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income Category List */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Income by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeBreakdown.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No income transactions recorded for this period.
              </p>
            ) : (
              <div className="space-y-3">
                {incomeBreakdown.map((item, idx) => {
                  const percentage = summaryData?.totals?.income
                    ? ((item.amount / summaryData.totals.income) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {item.category}
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(item.amount, currency)} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
