"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Github, Linkedin, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/ui/custom/shared/loader";
import { SelectAgentModal } from "@/components/ui/custom/form/select-agent-modal";
import { EditProfileModal } from "@/components/ui/custom/form/edit-profile-modal";
import { NewResearcherForm } from "@/components/ui/custom/form/new-researcher-form";
import { SuccessResponse } from "@/types/researcher";

// Definir tipos
type Researcher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  githubUsername: string;
  avatarUrl: string;
  repositoryUrl: string;
  linkedinProfile: string;
  createdAt: string;
  currentRol: string;
};

type ResearcherUpdate = {
  currentRole: string;
  githubUsername: string;
  linkedinProfile: string;
};

export function ResearcherForm() {
  const [refreshAgentKey, setRefreshAgentKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [existingResearcher, setExistingResearcher] =
    useState<Researcher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const api = useApi();

  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });

  const loadResearcherDetails = async () => {
    setIsLoading(true);
    
    if (!profile?.email) {
      setError(
        "No se encontró información del usuario. Por favor, inicia sesión nuevamente."
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Researcher>(
        `/researchers-managements/researchers?email=${profile.email}`
      );
      setExistingResearcher(data);
      setError(null);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error checking researcher:", error);
        setError(
          "Error al verificar el estado del investigador. Por favor, intenta nuevamente."
        );
      } else {
        setExistingResearcher(null);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResearcherDetails();
  }, [profile?.email]);

  useEffect(() => {
    if (existingResearcher) {
      setUpdateForm({
        currentRole: existingResearcher.currentRol || "",
        githubUsername: existingResearcher.githubUsername || "",
        linkedinProfile: existingResearcher.linkedinProfile || "",
      });
    }
  }, [existingResearcher]);

  const handleSuccess = (data: SuccessResponse) => {
    setRefreshAgentKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <Loader />
          <p className="text-muted-foreground">Verificando información...</p>
        </div>
      </div>
    );
  }

  if (error && !existingResearcher) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              onClick={loadResearcherDetails}
              className="mt-4"
            >
              Intentar nuevamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (existingResearcher) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={existingResearcher.avatarUrl}
                  alt={existingResearcher.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {existingResearcher.name}
                  </h2>
                  <EditProfileModal
                    email={profile?.email || ""}
                    initialData={{
                      currentRole: existingResearcher.currentRol || "",
                      githubUsername: existingResearcher.githubUsername || "",
                      linkedinProfile: existingResearcher.linkedinProfile || "",
                      phone: existingResearcher.phone || "",
                    }}
                    onSuccess={() => {
                      if (profile?.email) {
                        loadResearcherDetails();
                      }
                    }}
                  />
                </div>
                <p className="text-muted-foreground">
                  {existingResearcher.currentRol || "Investigador"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Información de Contacto</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Email: {existingResearcher.email}</p>
                  <p>Teléfono: {existingResearcher.phone}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Perfiles</h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://github.com/${existingResearcher.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  {existingResearcher.linkedinProfile && (
                    <a
                      href={existingResearcher.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Miembro desde{" "}
                  {new Date(existingResearcher.createdAt).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
          <SelectAgentModal
            email={profile?.email || ""}
            onSuccess={handleSuccess}
            refreshAgentKey={refreshAgentKey}
          />
        </CardContent>
      </Card>
    );
  }

  // Si no existe el investigador, mostrar el formulario de registro
  return (
    <>
      <NewResearcherForm
        onSuccess={handleSuccess}
        initialData={{
          name: profile?.name || "",
          email: profile?.email || "",
        }}
      />
    </>
  );
}
