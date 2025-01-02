"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { AuthLoading } from "@/components/auth/auth-loading";

export default function DashboardPage() {
  const { logout, keycloak, initialized, authenticated } = useAuth();
  const userName = keycloak?.tokenParsed?.preferred_username || "Usuario";

  if (!initialized || !authenticated) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Bienvenido, {userName}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Placeholder 1 */}
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
            <div className="h-40 bg-muted rounded-md animate-pulse" />
          </div>
          
          {/* Card Placeholder 2 */}
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Card Placeholder 3 */}
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Tareas Pendientes</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 