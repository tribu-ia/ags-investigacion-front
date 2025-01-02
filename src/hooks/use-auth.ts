import { useSession } from "@/providers/session-provider";
import { useEffect, useState } from "react";

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email_verified?: boolean;
  roles?: string[];
}

export function useAuth() {
  const { keycloak, authenticated, initialized, logout: keycloakLogout } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (authenticated && keycloak?.tokenParsed) {
      const tokenData = keycloak.tokenParsed as any;
      setProfile({
        id: tokenData.sub,
        email: tokenData.email,
        name: tokenData.name,
        given_name: tokenData.given_name,
        family_name: tokenData.family_name,
        preferred_username: tokenData.preferred_username,
        email_verified: tokenData.email_verified,
        roles: tokenData.realm_access?.roles || [],
      });
    } else {
      setProfile(null);
    }
  }, [authenticated, keycloak?.tokenParsed]);

  const hasRole = (role: string): boolean => {
    return profile?.roles?.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  return {
    profile,
    hasRole,
    hasAnyRole,
    isLoading: !initialized,
    isAuthenticated: authenticated,
    logout: keycloakLogout,
  };
} 