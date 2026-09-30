import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';
import { CreateCategoryModal } from '@/components/categories/CreateCategoryModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, Tags, ShieldCheck, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const CategoriesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const filteredCategories = categories.filter((c) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'expense') return c.type === 'expense' || c.type === 'both';
    if (activeTab === 'income') return c.type === 'income' || c.type === 'both';
    if (activeTab === 'custom') return !c.isDefault;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize and classify all your transactions with system & custom categories.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          size="sm"
          className="shadow-md shadow-primary/20 font-semibold"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Add Custom Category
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="custom">My Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-10 w-10 rounded-xl mb-3" />
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed">
          <Tags className="h-10 w-10 text-muted-foreground/40 mb-2" />
          <p className="font-semibold text-foreground">No categories found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {activeTab === 'custom'
              ? "You haven't created any custom categories yet. Click 'Add Custom Category' to make one!"
              : 'No categories match the active filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <Card
              key={cat._id}
              className="border-border/60 hover:shadow-md transition-all hover:border-primary/40 group relative overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  {/* Category Icon & Color avatar */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${cat.color || '#6366F1'}15`,
                      borderColor: cat.color || '#6366F1',
                    }}
                  >
                    <span>{cat.icon || '🏷️'}</span>
                  </div>

                  {/* Badge */}
                  {cat.isDefault ? (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                      Default
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px] gap-1 bg-primary/15 text-primary border-primary/20 hover:bg-primary/20 shadow-none">
                      <User className="h-3 w-3" />
                      Custom
                    </Badge>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    Type: {cat.type}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateCategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};
