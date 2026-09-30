import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingDown,
  TrendingUp,
  Inbox,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const TransactionTable = ({
  data = [],
  pagination,
  onPageChange,
  onLimitChange,
  sortBy,
  sortOrder,
  onSortChange,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const userCurrency = user?.currency || 'USD';

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: () => <span>Title & Notes</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm">
                {item.title}
              </span>
              {item.notes ? (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {item.notes}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: ({ row }) => {
          const type = row.getValue('type');
          const isIncome = type === 'income';
          return (
            <Badge variant={isIncome ? 'income' : 'expense'} className="gap-1">
              {isIncome ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="capitalize">{type}</span>
            </Badge>
          );
        },
      },
      {
        accessorKey: 'category',
        header: () => <span>Category</span>,
        cell: ({ row }) => {
          const category = row.getValue('category');
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
              {category}
            </span>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: () => (
          <button
            onClick={() => onSortChange('amount')}
            className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Amount</span>
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => {
          const item = row.original;
          const isIncome = item.type === 'income';
          return (
            <span
              className={`font-bold text-sm ${
                isIncome
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(item.amount, userCurrency)}
            </span>
          );
        },
      },
      {
        accessorKey: 'date',
        header: () => (
          <button
            onClick={() => onSortChange('date')}
            className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Date</span>
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => {
          return (
            <span className="text-xs text-muted-foreground font-medium">
              {formatDate(row.getValue('date'))}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onEdit(transaction)}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(transaction)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [userCurrency, onSortChange, onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      {/* Table Box */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={columns.length} className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-44 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                    <p className="font-medium text-sm">No transactions found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your filters or click New Transaction to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> transactions
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs font-medium px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
