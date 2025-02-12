"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/shared/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Trophy, Lightbulb, Target } from "lucide-react";
import { useChallengeStatus } from '@/contexts/challenge-status-context';
import { DetailPresentation } from "@/components/ui/custom/detail-presentation";
import { ResearcherInvestigations } from "@/components/ui/custom/researcher-investigations";

type ResearcherDetails = {
  name: string;
  email: string;
  avatarUrl: string;
  repositoryUrl: string;
  linkedinProfile: string;
  currentRole: string;
  githubUsername: string;
  presentationDate: string;
  presentationTime: string;
  agentName: string;
  status: string;
  presentationWeek: string;
  showOrder: number;
  assignmentId?: string;
};

type ResearcherUpdate = {
  currentRole: string;
  githubUsername: string;
  linkedinProfile: string;
};

export default function MisInvestigacionesPage() {
  const { challengeStatus } = useChallengeStatus();
  const { profile } = useAuth();
  const api = useApi();
  const [details, setDetails] = useState<ResearcherDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (profile?.email) {
      loadResearcherDetails();
    }
  }, [profile?.email]);

  const loadResearcherDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<ResearcherDetails>(`/researchers-managements/researchers/details?email=${profile?.email}`);
      setDetails(data);
      setUpdateForm({
        currentRole: data.currentRole || "",
        githubUsername: data.githubUsername || "",
        linkedinProfile: data.linkedinProfile || "",
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setDetails(null);
      } else {
        toast.error("Error al cargar los detalles del investigador");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await api.put(`/researchers-managements/researchers/${profile?.email}/profile`, updateForm);
      await loadResearcherDetails();
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const shouldShowUploadButton = details?.showOrder === challengeStatus?.currentMonth;

  const handleCreateProject = async () => {
    setIsSaving(true);
    try {
      if (!details?.assignmentId) {
        throw new Error('No assignment ID found');
      }

      const payload = {
        assignmentId: details.assignmentId,
        title: projectForm.name,
        description: projectForm.description,
        youtubeUrl: projectForm.videoUrl
      };

      const response = await api.post('/researchers-managements/agent-videos/upload', payload);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("¡Proyecto cargado exitosamente! Tu video ha sido registrado y será revisado por el equipo.");
        setIsCreatingProject(false);
        setProjectForm({ name: '', description: '', videoUrl: '' });
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      toast.error("Error al cargar el proyecto. Por favor intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="space-y-4 text-center">
          <Loader />
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Aún no eres investigador</h2>
          <p className="text-muted-foreground max-w-md">
            Para ver tus investigaciones, primero debes registrarte como investigador y seleccionar un agente para investigar.
          </p>
        </div>
        <a 
          href="/dashboard/documentation/nuevo-agente" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Comenzar a Investigar
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mis Investigación</h1>
        <p className="text-muted-foreground">
          Gestiona y monitorea tu investigación actual.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Detalles del Investigador */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">Investigador</Badge>
              {/* <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(details.status)}`}>
                {details.status}
              </span> */}
            </div>
            <CardTitle className="text-xl">Detalles del Investigador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={details.avatarUrl}
                  alt={details.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{details.name}</h3>
                  <p className="text-sm text-muted-foreground">{details.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Rol actual:</span> {details.currentRole || "No especificado"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">GitHub:</span>{" "}
                  <a href={details.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {details.githubUsername}
                  </a>
                </p>
                {details.linkedinProfile && (
                  <p className="text-sm">
                    <span className="font-medium">LinkedIn:</span>{" "}
                    <a href={details.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Ver perfil
                    </a>
                  </p>
                )}
              </div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Editar Perfil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentRole">Rol Actual</Label>
                      <Input
                        id="currentRole"
                        value={updateForm.currentRole}
                        onChange={(e) => setUpdateForm({ ...updateForm, currentRole: e.target.value })}
                        placeholder="Ej: Desarrollador Full Stack"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="githubUsername">Usuario de GitHub</Label>
                      <Input
                        id="githubUsername"
                        value={updateForm.githubUsername}
                        onChange={(e) => setUpdateForm({ ...updateForm, githubUsername: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinProfile">Perfil de LinkedIn</Label>
                      <Input
                        id="linkedinProfile"
                        value={updateForm.linkedinProfile}
                        onChange={(e) => setUpdateForm({ ...updateForm, linkedinProfile: e.target.value })}
                        placeholder="https://linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateProfile} 
                      className="w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? "Guardando cambios..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la Presentación */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">Presentación</Badge>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                {/* Semana {details.presentationWeek} */}
              </span>
            </div>
            <CardTitle className="text-xl">Detalles de la Presentación</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Mis Investigaciones</h1>
            <p className="text-muted-foreground">
              Gestiona y monitorea tus investigaciones actuales.
            </p>
          </div>

          {details && <ResearcherInvestigations details={details} />}
        </div>
          </CardContent>
        </Card>
      </div>

      
      <DetailPresentation />          


      {/* Dialog separado */}
      <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar Proyecto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Proyecto</Label>
              <Input
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL del Video</Label>
              <Input
                id="videoUrl"
                value={projectForm.videoUrl}
                onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleCreateProject} 
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? "Cargando..." : "Cargar Proyecto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
