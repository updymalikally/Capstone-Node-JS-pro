import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions.api';
import { categoriesApi } from '@/api/categories.api';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { DeleteConfirmDialog } from '@/components/transactions/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PlusCircle,
  Search,
  Download,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

export const TransactionsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  // Query parameters object
  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
    ...(categoryFilter !== 'all' ? { category: categoryFilter } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };

  // TanStack Query for Transactions
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => transactionsApi.getTransactions(queryParams),
  });

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
    toast.info('Filters reset to default');
  };

  // CSV Export
  const handleExportCSV = () => {
    const records = transactionsData?.data || [];
    if (records.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Title', 'Type', 'Category', 'Amount', 'Date', 'Notes'];
    const rows = records.map((tx) => [
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.type,
      `"${tx.category}"`,
      tx.amount,
      new Date(tx.date).toISOString().split('T')[0],
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactions exported to CSV');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, filter, and track all your financial logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="font-medium"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="shadow-md shadow-primary/20 font-semibold"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, category, or notes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <div>
            <Select
              value={typeFilter}
              onValueChange={(val) => {
                setTypeFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c.name}>
                    {c.icon} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/40 text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Date Filter:
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="h-8 text-xs w-36"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="h-8 text-xs w-36"
            />
          </div>
        </div>
      </div>

      {/* TanStack Table */}
      <TransactionTable
        data={transactionsData?.data || []}
        pagination={transactionsData?.pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => setLimit(newLimit)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onEdit={(tx) => setTransactionToEdit(tx)}
        onDelete={(tx) => setTransactionToDelete(tx)}
      />

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
