import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { transactionsApi } from '@/api/transactions.api';
import { Loader2, AlertTriangle } from 'lucide-react';

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => transactionsApi.deleteTransaction(transaction._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      toast.success('Transaction deleted');
      onClose();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to delete transaction';
      toast.error(msg);
    },
  });

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>Delete Transaction</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{transaction.title}"</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
