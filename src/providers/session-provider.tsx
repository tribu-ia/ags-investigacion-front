"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Keycloak from "keycloak-js";
import { AuthLoading } from "@/components/auth/auth-loading";

declare global {
  interface Window {
    _keycloak: any;
  }
}

type SessionContextType = {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  login: () => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType>({
  keycloak: null,
  initialized: false,
  authenticated: false,
  token: undefined,
  login: () => {},
  logout: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    
    const initKeycloak = async () => {

      const kc = new Keycloak({
        url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
        realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
        clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
      });

      try {
        const authenticated = await kc.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
          pkceMethod: "S256",
          checkLoginIframe: false,
        });

        setKeycloak(kc);
        setInitialized(true);
        window._keycloak = kc;

        if (authenticated && kc.token) {
          localStorage.setItem('kc_token', kc.token);
          
          refreshInterval = setInterval(async () => {
            console.group('🔄 Token Refresh Attempt');
            try {
              const refreshed = await kc.updateToken(70);
       
              if (refreshed && kc.token) {
                localStorage.setItem('kc_token', kc.token);

              }
            } catch (error) {
              console.error('Failed to refresh token:', error);
              clearInterval(refreshInterval);
              localStorage.removeItem('kc_token');
              kc.logout({
                redirectUri: window.location.origin,
              });
            }
            console.groupEnd();
          }, 60000);
        } else if (pathname.startsWith('/dashboard')) {
          console.log('User not authenticated, redirecting to login');
          await kc.login({
            redirectUri: window.location.origin + pathname,
          });
        }
      } catch (error) {
        console.error('Keycloak initialization error:', error);
        setInitialized(true);
      }
      console.groupEnd();
    };

    initKeycloak();

    return () => {
      console.log('Cleaning up Keycloak session');
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      localStorage.removeItem('kc_token');
    };
  }, [pathname]);

  const login = () => {
    if (keycloak) {
      keycloak.login({
        redirectUri: window.location.origin + "/dashboard",
      });
    }
    console.groupEnd();
  };

  const logout = () => {
    if (keycloak) {
      localStorage.removeItem('kc_token');
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
    console.groupEnd();
  };

  if (!initialized) {
    return <AuthLoading />;
  }

  if (pathname.startsWith('/dashboard') && !keycloak?.authenticated) {
    return <AuthLoading />;
  }

  return (
    <SessionContext.Provider
      value={{
        keycloak,
        initialized,
        authenticated: !!keycloak?.authenticated,
        token: keycloak?.token,
        login,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
} 