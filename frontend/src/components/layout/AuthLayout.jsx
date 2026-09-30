import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Wallet, Sun, Moon, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-muted/40 to-background overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar for theme switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="w-full max-w-md my-auto relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              FinanceFlow
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Smart, modern, real-time personal finance management
          </p>
        </div>

        {/* Auth Card Container */}
        <Outlet />

        {/* Feature Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            JWT Secured
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Real-time Analytics
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            TanStack Powered
          </span>
        </div>
      </div>
    </div>
  );
};
