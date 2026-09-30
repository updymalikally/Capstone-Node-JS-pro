import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { uploadApi } from '@/api/upload.api';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CURRENCIES, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Camera, Loader2, Save, User as UserIcon, Mail, Shield, Calendar, DollarSign } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      currency: user?.currency || 'USD',
    },
  });

  const selectedCurrency = watch('currency');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Avatar Upload Handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      await uploadApi.uploadProfilePicture(file);
      await refreshProfile();
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload profile picture';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsSaving(true);
      await updateUser({
        name: formData.name,
        currency: formData.currency,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal information, currency selection, and profile photo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar Card */}
        <Card className="border-border/60 text-center p-6 flex flex-col items-center justify-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
              {user?.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-3xl font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            {/* Upload overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:pointer-events-none"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <h2 className="text-lg font-bold mt-4">{user?.name}</h2>
          <p className="text-xs text-muted-foreground">{user?.email}</p>

          <div className="mt-3">
            <Badge variant={user?.role === 'admin' ? 'admin' : 'secondary'}>
              {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 text-xs w-full"
          >
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </Button>
        </Card>

        {/* Right Col: Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Update your display name and preferred currency symbol.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted cursor-not-allowed opacity-80"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Email address cannot be modified once registered.
                  </p>
                </div>

                {/* Currency Selector */}
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(val) => setValue('currency', val, { shouldDirty: true })}
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
              <CardFooter className="flex justify-end border-t border-border/40 pt-4">
                <Button type="submit" disabled={isSaving || !isDirty}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Account Meta Info */}
          <Card className="border-border/60 bg-muted/20">
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Joined: {formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Role: {user?.role || 'user'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
