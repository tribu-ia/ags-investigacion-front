"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";

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
};

type ResearcherUpdate = {
  currentRole: string;
  githubUsername: string;
  linkedinProfile: string;
};

export default function MisInvestigacionesPage() {
  const { profile } = useAuth();
  const api = useApi();
  const [details, setDetails] = useState<ResearcherDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateForm, setUpdateForm] = useState<ResearcherUpdate>({
    currentRole: "",
    githubUsername: "",
    linkedinProfile: "",
  });
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (profile?.email) {
      loadResearcherDetails();
    }
  }, [profile?.email]);

  const loadResearcherDetails = async () => {
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

  const handleCreateProject = async () => {
    // Add project creation logic here
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
        <h1 className="text-3xl font-bold">Mi Investigación</h1>
        <p className="text-muted-foreground">
          Gestiona y monitorea tu investigación actual.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Fecha:</span> {details.presentationDate}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Hora:</span> {details.presentationTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Agente:</span> {details.agentName}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Asegúrate de tener tu presentación lista para la fecha indicada.
                  Recuerda que debes demostrar el funcionamiento de tu investigación.
                </p>
              </div>
              <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Cargar Proyecto</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cargar Nuevo Proyecto</DialogTitle>
                    <DialogDescription>
                      Completa los detalles de la implementación de tú agente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Nombre del Proyecto</Label>
                      <Input
                        id="projectName"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                        placeholder="Ej: TribuAI Agentico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Descripción</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Describe tu proyecto..."
                        rows={4}
                        maxLength={250}
                      />
                      <div className={`text-sm ${
                        projectForm.description.length > 450 ? 'text-amber-500' : 'text-muted-foreground'
                      }`}>
                        {projectForm.description.length}/250 caracteres
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL del Video</Label>
                      <Input
                        id="videoUrl"
                        value={projectForm.videoUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                    </div>
                    <Button
                      onClick={handleCreateProject}
                      className="w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? "Cargando proyecto..." : "Cargar Proyecto"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guía y Premiación */}
      <div className="space-y-6">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Guía Presentacion y Estructura Premiación</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="structure" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Estructura de la Presentación</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-8">
                    {/* Previous presentation structure content */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Estructura General (10 minutos)</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">1 min</Badge>
                            <h4 className="font-medium">Introducción</h4>
                          </div>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Presentar el agente de IA</li>
                            <li>• Explicar brevemente su propósito</li>
                            <li>• Problema que resuelve</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">5 min</Badge>
                            <h4 className="font-medium">Detalles Técnicos</h4>
                          </div>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Descripción de la arquitectura</li>
                            <li>• Componentes principales</li>
                            <li>• Algoritmos o modelos utilizados</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">2 min</Badge>
                            <h4 className="font-medium">Impacto y Escenarios</h4>
                          </div>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Aplicaciones prácticas</li>
                            <li>• Ejemplos de uso</li>
                            <li>• Casos hipotéticos</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">1 min</Badge>
                            <h4 className="font-medium">Diferenciación</h4>
                          </div>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Características únicas</li>
                            <li>• Limitaciones encontradas</li>
                            <li>• Desafíos principales</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">1 min</Badge>
                            <h4 className="font-medium">Conclusión</h4>
                          </div>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Resumen de puntos clave</li>
                            <li>• Sesión de preguntas</li>
                            <li>• Próximos pasos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="approaches" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Enfoques Sugeridos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    {/* Previous approaches content */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="p-6 rounded-lg border bg-card">
                        <h4 className="text-base font-medium mb-4">Enfoque 1: Arquitectura Técnica</h4>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Este enfoque se centra en la estructura técnica y la implementación del agente.</p>

                          <div>
                            <h5 className="font-medium mb-2">Introducción:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Nombre y propósito del agente</li>
                              <li>• ¿Qué problema aborda y por qué es importante?</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Detalles Técnicos:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Explicar el patrón de arquitectura utilizado (e.g., cliente-servidor, orquestación distribuida)</li>
                              <li>• Describir cómo se organizan los componentes del agente (e.g., entrada, procesamiento, salida)</li>
                              <li>• Algoritmos o modelos utilizados (e.g., redes neuronales, árboles de decisión)</li>
                              <li>• Uso de frameworks o bibliotecas específicas (e.g., LangChain, OpenAI API)</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Impacto y Escenarios de Uso:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Ejemplo de un caso técnico, como un flujo de datos de entrada a salida</li>
                              <li>• Escalabilidad del agente y rendimiento en diferentes contextos</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Diferenciación y Limitaciones:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• ¿Por qué se eligió esta arquitectura en lugar de otras opciones?</li>
                              <li>• Desafíos técnicos encontrados durante la implementación</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Conclusión y Preguntas:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Reafirmar la importancia de la arquitectura técnica</li>
                              <li>• Abrir la discusión para profundizar en detalles</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-lg border bg-card">
                        <h4 className="text-base font-medium mb-4">Enfoque 2: Caso de Uso</h4>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Este enfoque prioriza los resultados y aplicaciones prácticas del agente.</p>

                          <div>
                            <h5 className="font-medium mb-2">Introducción:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Presentar el agente y su propósito</li>
                              <li>• Contextualizar el caso de uso principal</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Descripción del caso de uso:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Describir un caso de uso específico</li>
                              <li>• Problema que enfrenta el usuario</li>
                              <li>• Cómo el agente/producto resuelve el problema</li>
                              <li>• Beneficios medibles (e.g., tiempo ahorrado, precisión mejorada)</li>
                              <li>• Otros escenarios donde el agente podría ser útil</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Detalle técnico:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Explicar brevemente cómo el agente está diseñado para cumplir el caso de uso</li>
                              <li>• Algoritmos o modelos clave utilizados</li>
                              <li>• Recursos requeridos para implementar el agente</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Diferenciación y Limitaciones:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Comparación con agentes similares para el mismo caso de uso</li>
                              <li>• Limitaciones prácticas (e.g., requerimientos computacionales, entrenamiento)</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Conclusión y Preguntas:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Resaltar el impacto práctico del agente</li>
                              <li>• Abrir para sugerencias o dudas sobre aplicaciones</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Disponibilidad y/o licenciamiento:</h5>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                              <li>• Tipo de licencia (cerrada, abierta, restringida, requiere pago, etc)</li>
                              <li>• Modelo de negocio o monetización del producto</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prizes" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Premiación Mensual</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-6">
                    {/* Fechas del Ciclo */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Fechas del Primer Ciclo (Enero-Marzo 2025)</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <p>Inicio: Lunes 21 de enero, 2025</p>
                        </div>
                        <p className="ml-6">Duración: 7 semanas (Cada ciclo se reinicia mensualmente)</p>
                      </div>
                    </div>

                    {/* Condiciones */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Condiciones Generales</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Características de implementación:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                            <li>La implementación debe quedar cargada en el Agente que investigaste como Open Source si es código en el repositorio de Tribu IA</li>
                            <li>Puedes empezar un proyecto desde cero o hacer una extensión a un producto propio tuyo pero el apartado de Agente debe quedar cargado en el repositorio de Tribu IA</li>
                            <li>Debe tener una aplicación en el mundo real (que tan útil es)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Participación en Equipo:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                            <li>Se fomenta el trabajo en equipo dentro de la comunidad</li>
                            <li>Si un participante logra involucrar activamente a la comunidad en la construcción o discusión técnica, se otorgarán 5 puntos adicionales</li>
                            <li>La participación en retos o discusiones técnicas de otros programas de Tribu IA es altamente recomendada. Ejemplo proyectos que tengan en Retos IA</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Subida de Videos:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                            <li>Los videos deben ser menor o máximo de un minuto donde cuentes cuál fue tu solución (Este será el video que verán las personas para realizar la votación)</li>
                            <li>Fecha límite: Martes 18 de febrero, 2025, antes de la charla semanal</li>
                            <li>Se abre plataforma de carga de video el Martes 11 de febrero después de la charla</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Calendario */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Calendario de Actividades</h3>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-2">Semanas 1-4: Inicio y Progreso</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Lunes: Se presentan los participantes y deciden si desean inscribirse</li>
                            <li>• Se divulgan los agentes asignados para trabajar en las semanas</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-2">Semana 5: Evaluación</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Martes 18 de febrero: Fecha límite para cargar los videos de las implementaciones (W1-W4)</li>
                            <li>• Apertura de votaciones al finalizar la charla técnica</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-2">Semana 6: Cierre de Votaciones</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Martes 25 de febrero: Se cierran las votaciones antes de la charla semanal</li>
                            <li>• Durante la charla, se anuncia el ganador</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-2">Semana 7: Premiación y Charla Técnica</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Martes 4 de marzo: Sesión especial donde el ganador realizará un taller práctico</li>
                            <li>• El ganador enseñará a las personas a implementar su Agente</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Criterios de Evaluación */}
                    <div className="rounded-lg border p-6 bg-primary/5">
                      <h3 className="text-lg font-medium mb-4">Criterios de Evaluación</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <div>
                            <span className="font-medium">Creatividad e Innovación:</span>
                            <span className="text-muted-foreground"> ¿Qué tan original es la solución?</span>
                          </div>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <div>
                            <span className="font-medium">Colaboración:</span>
                            <span className="text-muted-foreground"> ¿Involucró a otros miembros de la comunidad?</span>
                          </div>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <div>
                            <span className="font-medium">Impacto:</span>
                            <span className="text-muted-foreground"> ¿Qué tan útil o significativo es el agente desarrollado?</span>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Premio */}
                    <div className="rounded-lg border bg-primary/5 p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Premio al Primer Lugar
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span className="font-medium">$300 USD</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          Participación en evento en vivo simultáneo en las ciudades donde se consigan locaciones
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          Reconocimiento en la comunidad
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>


            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
