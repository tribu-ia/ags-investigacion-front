"use client";

import { useAuth } from "@/hooks/use-auth";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { hasAnyRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasAnyRole(roles)) {
    return fallback;
  }

  return <>{children}</>;
} 