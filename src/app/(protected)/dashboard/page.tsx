"use client";

import { AuthLoading } from "@/components/auth/auth-loading";

import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { profile, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [data, setData] = useState(null);
  const userName = profile?.preferred_username || "Usuario";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Ejemplo de cómo usar el cliente API con el token
    if (isAuthenticated) {
      api.get('/tu-endpoint')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [isAuthenticated, api]);

  if (isLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
