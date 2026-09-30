import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Tags,
  User,
  ShieldAlert,
  X,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: Receipt,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: PieChart,
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: Tags,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      name: 'Admin Panel',
      href: '/admin',
      icon: ShieldAlert,
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Header in sidebar */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40 lg:hidden">
          <span className="font-bold text-lg text-primary">FinanceFlow</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
          <div className="space-y-1.5">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Card / Info */}
          <div className="pt-6">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-xs">
                <HelpCircle className="h-4 w-4" />
                <span>API Documentation</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Explore the interactive REST API swagger documentation.
              </p>
              <a
                href="/docs"
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full py-1.5 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-lg transition-colors"
              >
                Open Swagger UI ↗
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
