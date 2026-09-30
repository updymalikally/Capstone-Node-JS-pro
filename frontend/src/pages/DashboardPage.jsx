import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { transactionsApi } from '@/api/transactions.api';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { DeleteConfirmDialog } from '@/components/transactions/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Fetch monthly summary
  const { data: monthlySummary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['monthly-summary'],
    queryFn: () => transactionsApi.getMonthlySummary(),
  });

  // Fetch recent transactions (first page, limit 5)
  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', { page: 1, limit: 5, sortBy: 'date', sortOrder: 'desc' }],
    queryFn: () =>
      transactionsApi.getTransactions({
        page: 1,
        limit: 5,
        sortBy: 'date',
        sortOrder: 'desc',
      }),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-3xl border border-primary/20">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Good day, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here is your financial pulse for{' '}
            <span className="font-semibold text-foreground">
              {monthlySummary?.period?.monthName} {monthlySummary?.period?.year}
            </span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="shadow-md shadow-primary/20 font-semibold"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <SummaryCards
        summaryData={monthlySummary}
        isLoading={isSummaryLoading}
      />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart
          transactions={transactionsData?.data || []}
        />
        <CategoryPieChart
          categoryBreakdown={monthlySummary?.categoryBreakdown?.expense || []}
        />
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <p className="text-xs text-muted-foreground">
              Your 5 most recent transactions
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/transactions" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <TransactionTable
          data={transactionsData?.data || []}
          isLoading={isTransactionsLoading}
          onSortChange={() => {}}
          onEdit={(tx) => setTransactionToEdit(tx)}
          onDelete={(tx) => setTransactionToDelete(tx)}
        />
      </div>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {transactionToEdit && (
        <TransactionFormModal
          isOpen={!!transactionToEdit}
          transactionToEdit={transactionToEdit}
          onClose={() => setTransactionToEdit(null)}
        />
      )}

      {transactionToDelete && (
        <DeleteConfirmDialog
          isOpen={!!transactionToDelete}
          transaction={transactionToDelete}
          onClose={() => setTransactionToDelete(null)}
        />
      )}
    </div>
  );
};
