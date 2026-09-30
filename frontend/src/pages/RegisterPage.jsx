import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
import { CURRENCIES } from '@/lib/utils';
import { toast } from 'sonner';
import { UserPlus, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      currency: 'USD',
      role: 'user',
    },
  });

  const selectedCurrency = watch('currency');

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
      await registerAuth({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        currency: selectedCurrency || formData.currency || 'USD',
        role: 'user',
      });
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      const msg = extractErrorMessage(error, 'Failed to create account. Please verify your details.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-xl backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Get started with your personal finance tracker today.
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

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Alex Johnson"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters',
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
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

          {/* Currency Preference */}
          <div className="space-y-1.5">
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={(val) => setValue('currency', val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((cur) => (
                  <SelectItem key={cur.code} value={cur.code}>
                    {cur.name} ({cur.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Sign Up
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
            >
              Sign In <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
