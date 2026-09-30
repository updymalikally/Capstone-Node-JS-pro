import React from 'react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoriesApi } from '@/api/categories.api';
import { Loader2 } from 'lucide-react';

const COMMON_EMOJIS = ['🏷️', '🍔', '🚗', '🏠', '✈️', '🎮', '💊', '🎓', '🛍️', '💼', '💻', '📈', '🎁', '⚡', '☕', '🏋️', '📚', '🎬'];
const COMMON_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#3B82F6', '#14B8A6', '#84CC16'];

export const CreateCategoryModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: 'expense',
      icon: '🏷️',
      color: '#6366F1',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const selectedType = watch('type');

  const mutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      reset();
      onClose();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to create category';
      toast.error(msg);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            Add a new category to categorize your expenses or income.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Subscriptions, Freelance, Gym"
              {...register('name', { required: 'Category name is required' })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Applies To</Label>
            <Select
              value={selectedType}
              onValueChange={(val) => setValue('type', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="both">Both (Income & Expense)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <Label>Choose Icon</Label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1.5 border rounded-lg bg-muted/20">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue('icon', emoji)}
                  className={`h-9 w-9 text-lg flex items-center justify-center rounded-lg border transition-transform hover:scale-110 ${
                    selectedIcon === emoji
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-transparent hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <Label>Category Color</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {COMMON_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c)}
                  className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                    selectedColor === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Preview Badge */}
          <div className="pt-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Preview</Label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border bg-card">
              <span className="text-xl">{selectedIcon}</span>
              <span className="font-semibold text-sm" style={{ color: selectedColor }}>
                {watch('name') || 'Category Name'}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-3">
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
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
