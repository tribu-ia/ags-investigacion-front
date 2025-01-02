import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

export const keycloak = typeof window !== "undefined" ? new Keycloak(keycloakConfig) : null;

export const initKeycloak = async () => {
  if (!keycloak) return;
  
  try {
    const authenticated = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    });
    
    return authenticated;
  } catch (error) {
    console.error("Keycloak init error:", error);
    return false;
  }
};

export const login = () => {
  if (!keycloak) return;
  keycloak.login();
};

export const logout = () => {
  if (!keycloak) return;
  keycloak.logout();
};

export const getToken = () => {
  return keycloak?.token;
};

export const isAuthenticated = () => {
  return !!keycloak?.authenticated;
};

export const updateToken = (minValidity: number = 5) => {
  return keycloak?.updateToken(minValidity);
}; 