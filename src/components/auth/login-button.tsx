"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/providers/session-provider";

export function LoginButton() {
  const { login, authenticated, initialized } = useSession();

  if (!initialized || authenticated) {
    return null;
  }

  return (
    <Button onClick={login} variant="default">
      Iniciar Sesión
    </Button>
  );
} 