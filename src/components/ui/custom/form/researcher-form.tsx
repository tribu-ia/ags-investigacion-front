"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Github, Linkedin, Discord, XCircle, PlusCircle, Settings, BookOpen } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/ui/custom/shared/loader";
import { toast } from "sonner"
import { SelectAgentModal } from "./select-agent-modal"
import { EditProfileModal } from "./edit-profile-modal"
import { NewResearcherForm } from "./new-researcher-form"
import { SuccessResponse } from "@/types/researcher"


type ApiResponse = {
  status: string;
  message: string;
  data?: {
    success: boolean;
    message: string;
    error_type: string;
  }
}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [existingResearcher, setExistingResearcher] = useState<Researcher | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useAuth()
  const api = useApi()
  const router = useRouter()

  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)



  const loadResearcherDetails = async () => {
    if (!profile?.email) {
      setError("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Researcher>(`/researchers-managements/researchers?email=${profile.email}`);
      setExistingResearcher(data);
      setError(null);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error checking researcher:', error);
        setError("Error al verificar el estado del investigador. Por favor, intenta nuevamente.");
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

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const renderSuccessDialog = () => {
    if (!successData) return null;

    const isPrimaryResearcher = successData.researcher_type === "PRIMARY";

    return (
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              ¡Bienvenido a TribuIA/Agentes! - {isPrimaryResearcher ?
                "Investigador Primario" :
                "Investigador Contribuidor"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Lado izquierdo - Perfil */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-6">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-32 overflow-hidden rounded-full border-4 border-white/80">
                  <img
                    src={successData.data.avatarUrl}
                    alt={successData.data.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">{successData.data.name}</h3>
                  {successData.presentationDateTime && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Fecha tentativa de presentación:</p>
                      <p className="font-medium">{formatDateTime(successData.presentationDateTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lado derecho - Contenido específico según tipo */}
            {isPrimaryResearcher ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <h4 className="text-lg font-semibold">Únete a nuestro Discord</h4>
                <Image
                  src="/QR.png"
                  alt="Discord QR"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-md"
                />
                <a
                  href="https://discord.gg/VJzNePg4fB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-2"
                >
                  <Discord className="h-5 w-5" />
                  Unirte al grupo
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <h4 className="text-lg font-semibold">Comienza a Documentar</h4>
                <p className="text-sm text-center text-muted-foreground">
                  Accede al centro de investigación para comenzar a documentar
                </p>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                  <Button
                    onClick={() => {
                      router.push('/dashboard/centro-investigacion/agente')
                      setShowSuccessModal(false)
                    }}
                  >
                    Ir al Centro de Investigación
                  </Button>
                  <a
                    href="https://github.com/TribuAguirre/tribu-ia-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-primary hover:text-primary/80"
                  >
                    <Github className="h-5 w-5" />
                    Repositorio TribuIA
                  </a>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleSuccess = (data: SuccessResponse) => {
    setRefreshAgentKey(prev => prev + 1)
  }

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

  if (error) {
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
                <img
                  src={existingResearcher.avatarUrl}
                  alt={existingResearcher.name}
                  className="rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{existingResearcher.name}</h2>
                  <EditProfileModal 
                    open={isEditProfileOpen}
                    onOpenChange={setIsEditProfileOpen}
                    email={profile?.email || ""}
                    initialData={{
                      currentRole: existingResearcher.currentRol || "",
                      githubUsername: existingResearcher.githubUsername || "",
                      linkedinProfile: existingResearcher.linkedinProfile || "",
                    }}
                    onSuccess={() => {
                      if (profile?.email) {
                        loadResearcherDetails()
                      }
                    }}
                  />
                </div>
                <p className="text-muted-foreground">{existingResearcher.currentRol || 'Investigador'}</p>
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
                  Miembro desde {new Date(existingResearcher.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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
  )
}
