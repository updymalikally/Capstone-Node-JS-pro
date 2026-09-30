import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { transactionsApi } from '@/api/transactions.api';
import { categoriesApi } from '@/api/categories.api';
import { Loader2 } from 'lucide-react';

export const TransactionFormModal = ({
  isOpen,
  onClose,
  transactionToEdit = null,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!transactionToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedType = watch('type');
  const selectedCategory = watch('category');

  // Fetch available categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    enabled: isOpen,
  });

  // Filter categories based on transaction type (or type === 'both')
  const filteredCategories = categories.filter(
    (c) => c.type === 'both' || c.type === selectedType
  );

  useEffect(() => {
    if (transactionToEdit) {
      reset({
        title: transactionToEdit.title,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        date: transactionToEdit.date
          ? new Date(transactionToEdit.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: transactionToEdit.notes || '',
      });
    } else {
      reset({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [transactionToEdit, isOpen, reset]);

  // Mutation for creating / updating
  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        title: data.title,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        date: data.date,
        notes: data.notes,
      };

      if (isEditing) {
        return transactionsApi.updateTransaction(transactionToEdit._id, payload);
      }
      return transactionsApi.createTransaction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      toast.success(
        isEditing
          ? 'Transaction updated successfully'
          : 'Transaction created successfully'
      );
      onClose();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to save transaction';
      toast.error(msg);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this transaction below.'
              : 'Fill in the form to track your income or expense.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Type Selector (Income vs Expense) */}
          <div className="space-y-1.5">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={selectedType === 'expense' ? 'destructive' : 'outline'}
                onClick={() => {
                  setValue('type', 'expense');
                  setValue('category', '');
                }}
                className="w-full font-medium"
              >
                💸 Expense
              </Button>
              <Button
                type="button"
                variant={selectedType === 'income' ? 'success' : 'outline'}
                onClick={() => {
                  setValue('type', 'income');
                  setValue('category', '');
                }}
                className="w-full font-medium"
              >
                💰 Income
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title / Description</Label>
            <Input
              id="title"
              placeholder="e.g. Grocery Store, Salary, Coffee"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters',
                },
              })}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => setValue('category', val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    No categories available.
                  </div>
                ) : (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon || '🏷️'}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register('category', { required: 'Please select a category' })}
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional details..."
              {...register('notes')}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
