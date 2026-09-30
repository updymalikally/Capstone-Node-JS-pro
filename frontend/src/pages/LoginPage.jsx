import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn, Loader2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const extractErrorMessage = (error, fallback) => {
    // Network error — backend not running or proxy can't connect
    if (!error.response) {
      return 'Cannot connect to server. Please make sure the backend is running on port 5000.';
    }
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.map((e) => e.message).join(' • ');
    }
    return error.response?.data?.message || fallback;
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      await login(formData);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const msg = extractErrorMessage(error, 'Invalid email or password');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Instant Demo Login
  const handleQuickDemo = async (email, password, name = 'Demo User', role = 'user') => {
    setValue('email', email);
    setValue('password', password);
    setErrorMessage('');
    try {
      setIsLoading(true);
      try {
        // First try to login
        await login({ email, password });
      } catch (loginError) {
        // If user doesn't exist yet, auto-register and login
        if (loginError.response?.status === 401 || loginError.response?.status === 400) {
          await registerUser({
            name,
            email,
            password,
            role,
            currency: 'USD',
          });
        } else {
          throw loginError;
        }
      }
      toast.success(`Logged in as ${role === 'admin' ? 'Admin' : 'Demo User'}!`);
      navigate('/dashboard');
    } catch (error) {
      const msg = extractErrorMessage(error, 'Failed to sign in with demo account');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-xl backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your personal finance dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Error Banner if any */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Quick Demo Credentials */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 text-xs space-y-2">
            <span className="font-semibold text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Quick Instant Login:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo('demo@example.com', 'password123', 'Demo User', 'user')}
                disabled={isLoading}
                className="h-8 text-xs font-medium justify-center bg-background/80 hover:bg-primary/10 hover:border-primary/50"
              >
                👤 Standard User
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo('admin@example.com', 'admin123', 'Admin User', 'admin')}
                disabled={isLoading}
                className="h-8 text-xs font-medium justify-center bg-background/80 hover:bg-amber-500/10 hover:border-amber-500/50 text-amber-600 dark:text-amber-400"
              >
                🛡️ Admin Account
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full font-semibold shadow-md shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
            >
              Sign Up <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
