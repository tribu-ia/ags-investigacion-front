"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Acceso No Autorizado</h1>
        <p className="text-muted-foreground">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/")}>
            Volver al Inicio
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            Volver Atrás
          </Button>
        </div>
      </div>
    </div>
  );
} 