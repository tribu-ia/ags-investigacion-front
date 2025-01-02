"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { AuthLoading } from "./auth-loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { authenticated, initialized, keycloak, login } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !authenticated) {
      login();
      return;
    }

    if (roles && authenticated && keycloak?.tokenParsed) {
      const userRoles = (keycloak.tokenParsed as any).realm_access?.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [authenticated, initialized, router, roles, keycloak?.tokenParsed, login]);

  if (!initialized) {
    return <AuthLoading />;
  }

  if (!authenticated) {
    return <AuthLoading />;
  }

  return <>{children}</>;
} 