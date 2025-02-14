"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { AgentSearch } from "@/components/ui/custom/form/agent-search"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { InfoIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/ui/custom/shared/loader";
import { toast } from "sonner"
import { SelectAgentModal } from "./select-agent-modal"
import { EditProfileModal } from "./edit-profile-modal"
import { NewResearcherForm } from "./new-researcher-form"

const formSchema = z.object({
  agent: z.string({
    required_error: "Por favor selecciona un agente",
  }).min(1, "Por favor selecciona un agente"),
  researcher_type: z.enum(["primary", "contributor"], {
    required_error: "Por favor selecciona un tipo de investigador",
  }),
  name: z.string({
    required_error: "El nombre es obligatorio",
  }).min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  email: z.string({
    required_error: "El correo electrónico es obligatorio",
  }).email("Por favor ingresa un correo electrónico válido"),
  phone: z.string({
    required_error: "El teléfono es obligatorio",
  }).regex(/^\+?[0-9]{10,15}$/, "Por favor ingresa un número de teléfono válido (10-15 dígitos, puede incluir + al inicio)"),
  github_username: z.string({
    required_error: "El usuario de GitHub es obligatorio",
  }).min(1, "Por favor ingresa tu usuario de GitHub"),
  linkedin_profile: z.string({
    required_error: "El perfil de LinkedIn es obligatorio",
  }).min(1, "Por favor ingresa tu perfil de LinkedIn")
    .url("Por favor ingresa una URL válida de LinkedIn"),
})

type ApiResponse = {
  status: string;
  message: string;
  data?: {
    success: boolean;
    message: string;
    error_type: string;
  }
}

type SuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    githubUsername: string;
    avatarUrl: string;
    repositoryUrl: string;
    linkedinProfile: string | null;
    agentId: string;
    status: string;
  };
  researcher_type: "primary" | "contributor";
  presentationDateTime: string | null;
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [existingResearcher, setExistingResearcher] = useState<Researcher | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useAuth()
  const api = useApi()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });
  const [isSelectingAgent, setIsSelectingAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [researcherType, setResearcherType] = useState<"primary" | "contributor">("contributor");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name || profile.preferred_username || "")
      form.setValue("email", profile.email || "")
    }
  }, [profile, form])

  useEffect(() => {
    const checkExistingResearcher = async () => {
      if (!profile?.email) {
        setError("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<Researcher>(`/researchers-managements/researchers?email=${profile.email}`);

        if (response && response.data) {
          setExistingResearcher(response.data);
          setError(null);
        } else {
          setExistingResearcher(null);
        }
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

    checkExistingResearcher();
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

    const isPrimaryResearcher = successData.researcher_type === "primary";

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

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      if (!profile?.email) {
        throw new Error('No email found');
      }

      await api.put(
        `/researchers-managements/researchers/${profile.email}/profile`,
        updateForm
      );

      // Recargar los datos del investigador
      const { data } = await api.get<Researcher>(`/researchers-managements/researchers?email=${profile.email}`);
      setExistingResearcher(data);

      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewAgentSubmit = async () => {
    setIsSaving(true);
    try {
      if (!profile?.email || !selectedAgent) {
        throw new Error('Información incompleta');
      }

      const payload = {
        email: profile.email,
        agent: selectedAgent,
        researcher_type: researcherType
      };

      await api.post('/researchers-managements/researchers/assign-agent', payload);

      // Recargar los datos del investigador
      const { data } = await api.get<Researcher>(`/researchers-managements/researchers?email=${profile.email}`);
      setExistingResearcher(data);

      setIsSelectingAgent(false);
      toast.success("Agente asignado correctamente");
      setSelectedAgent("");
      setResearcherType("contributor");
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast.error("Error al asignar el agente");
    } finally {
      setIsSaving(false);
    }
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
              onClick={() => window.location.reload()}
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
              <div>
                <h2 className="text-2xl font-bold">{existingResearcher.name}</h2>
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

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-medium">Acciones Rápidas</h3>
              <div className="grid gap-4 md:grid-cols-2">


                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/dashboard/documentation/mis-investigaciones')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Ver mis investigaciones
                </Button>


                <SelectAgentModal
                  email={profile?.email || ""}
                  onSuccess={() => {
                    // Recargar los datos del investigador
                    if (profile?.email) {
                      loadResearcherDetails()
                    }
                  }}
                  refreshAgentKey={refreshAgentKey}
                />

                <EditProfileModal 
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

                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/centro-investigacion/guias/')}
                  className="w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Recursos de investigación
                </Button>
              </div>
            </div>

            <div className="mt-6 text-sm text-center text-muted-foreground">
              <p>
                Miembro desde {new Date(existingResearcher.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no existe el investigador, mostrar el formulario de registro
  return (
    <NewResearcherForm 
      onSuccess={(data) => {
        setSuccessData(data)
        setShowSuccessModal(true)
      }}
      initialData={{
        name: profile?.name || "",
        email: profile?.email || "",
      }}
    />
  )
}
