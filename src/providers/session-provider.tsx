"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Keycloak from "keycloak-js";
import { AuthLoading } from "@/components/auth/auth-loading";

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
      console.log("SessionProvider: Initializing Keycloak...");
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

        console.log("SessionProvider: Keycloak initialized:", { authenticated });
        setKeycloak(kc);
        setInitialized(true);

        if (authenticated) {
          console.log("SessionProvider: User is authenticated");
          // Token refresh setup
          refreshInterval = setInterval(() => {
            kc.updateToken(70)
              .then((refreshed) => {
                if (refreshed) {
                  console.log("SessionProvider: Token refreshed successfully");
                }
              })
              .catch((error) => {
                console.error("SessionProvider: Failed to refresh token:", error);
                clearInterval(refreshInterval);
                kc.logout({
                  redirectUri: window.location.origin,
                });
              });
          }, 60000);
        } else if (pathname.startsWith('/dashboard')) {
          console.log("SessionProvider: User is not authenticated, redirecting to login");
          await kc.login({
            redirectUri: window.location.origin + pathname,
          });
        }
      } catch (error) {
        console.error("SessionProvider: Keycloak init error:", error);
        setInitialized(true);
      }
    };

    initKeycloak();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      console.log("SessionProvider: Cleaning up session");
    };
  }, [pathname]);

  const login = () => {
    console.log("SessionProvider: Login requested");
    if (keycloak) {
      keycloak.login({
        redirectUri: window.location.origin + "/dashboard",
      });
    }
  };

  const logout = () => {
    console.log("SessionProvider: Logout requested");
    if (keycloak) {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
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