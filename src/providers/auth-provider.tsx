"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Keycloak from "keycloak-js";
import { AuthLoading } from "@/components/auth/auth-loading";

type AuthContextType = {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  initialized: false,
  authenticated: false,
  token: undefined,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    });

    kc.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
      .then((auth) => {
        setKeycloak(kc);
        setInitialized(true);

        if (!auth) {
          kc.login({
            redirectUri: window.location.origin + window.location.pathname,
          });
          return;
        }

        // Token refresh setup
        setInterval(() => {
          kc.updateToken(70)
            .then((refreshed) => {
              if (refreshed) {
                console.log("Token refreshed");
              }
            })
            .catch(() => {
              console.error("Failed to refresh token");
              router.push("/");
            });
        }, 60000);
      })
      .catch((error) => {
        console.error("Keycloak init error:", error);
        setInitialized(true);
      });
  }, [router]);

  const login = () => {
    if (keycloak) {
      keycloak.login({
        redirectUri: window.location.origin + window.location.pathname,
      });
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
  };

  if (!initialized) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
} 