import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { Skeleton } from '@/components/ui/skeleton';

export const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6 bg-background">
        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="h-12 w-12 rounded-2xl bg-primary animate-pulse flex items-center justify-center text-primary-foreground font-bold text-xl">
            F
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your financial dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar for desktop and mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add Transaction Modal */}
      <TransactionFormModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  );
};
