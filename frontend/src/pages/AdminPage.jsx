import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin.api';
import { useAuth } from '@/context/AuthContext';
import { AdminOverviewCards } from '@/components/admin/AdminOverviewCards';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Navigate } from 'react-router-dom';

export const AdminPage = () => {
  const { user } = useAuth();

  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fetch admin platform overview
  const { data: overviewData, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: adminApi.getOverview,
  });

  // Fetch all users
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  });

  const topCategories = overviewData?.topExpenseCategories || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Console
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            System-wide analytics, platform metrics, and registered user directory.
          </p>
        </div>
      </div>

      {/* Admin KPI Overview Cards */}
      <AdminOverviewCards
        overviewData={overviewData}
        isLoading={isOverviewLoading}
      />

      {/* Top Expense Categories Across System */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            Top Expense Categories (Global System)
          </CardTitle>
          <CardDescription>
            Most frequent expenditure categories logged across all platform users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No expenditure data recorded across the system yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {topCategories.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border bg-muted/20 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{i + 1} {c.category}
                  </span>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(c.totalSpent, 'USD')}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {c.count} transactions
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Registered Users Directory
            </h2>
            <p className="text-xs text-muted-foreground">
              Total {users.length} registered accounts
            </p>
          </div>
        </div>

        <AdminUsersTable users={users} isLoading={isUsersLoading} />
      </div>
    </div>
  );
};
