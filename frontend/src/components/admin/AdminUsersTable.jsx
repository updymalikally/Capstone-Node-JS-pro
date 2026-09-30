import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminUsersTable = ({ users = [], isLoading }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="p-4">
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-8 text-muted-foreground text-sm">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u._id || u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {u.profilePicture ? (
                        <AvatarImage src={u.profilePicture} alt={u.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getInitials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground text-sm">
                      {u.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'admin' : 'secondary'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-xs">{u.currency || 'USD'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(u.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
