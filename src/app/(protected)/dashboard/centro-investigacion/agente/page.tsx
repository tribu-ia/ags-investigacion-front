"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/shared/loader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Upload } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import '@/styles/github-markdown.css';
import { AlertCircle, CheckCircle, Pen } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from "next/image";
import {motion, AnimatePresence} from 'framer-motion';
import { fadeSlideVariants, iconVariants } from "@/styles/animations";
import { useSidebar } from "@/components/ui/sidebar";
import { FinishDocumentationModal } from "@/components/finish-documentation-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ResearcherDetails = {
  name: string;
  email: string;
  avatarUrl: string;
  agentName: string;
  agentDescription: string;
  agentCategory: string;
  agentIndustry: string;
  primaryResearches: {
    assignmentId: string;
    agentName: string;
    agentDescription: string;
    agentCategory: string;
    agentIndustry: string;
    status: string;
  }[];
  contributorsResearches: {
    assignmentId: string;
    name: string;
    shortDescription: string;
    category: string;
    industry: string;
    status: string;
  }[];
};

const markdownExample = `# Título del Documento

## Descripción
Aquí va la descripción detallada de tu investigación.

## Características Principales
- Característica 1
- Característica 2
- Característica 3

## Ejemplo de Código
\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

## Tabla de Contenidos
| Sección | Descripción |
|---------|-------------|
| Intro   | Introducción|
| Demo    | Demostración|

> **Nota:** Este es un ejemplo de cómo se verá el formato en GitHub.
`;

// Definir tipos para los mensajes
type StartedMessage = {
  type: "research_start";
  message: string;
  data: {
    status: 'started';
  }
}

type ProgressMessage = {
  type: "research_progress";
  message: string;
};

type WritingProgressMessage = {
  type: "writing_progress";
  message: string;
};

type CompilerProgressMessage = {
  type: "compiler_progress";
  message: "final_report_chunk" | "final_report_complete";
  data: {
    type: "report_content";
    content: string;
    is_complete: boolean;
  };
};

type ErrorMessage = {
  type: "error";
  data: {
    error: string;
  };
};

// Actualizar el tipo WebSocketMessage
type WebSocketMessage =
  | StartedMessage
  | ProgressMessage
  | WritingProgressMessage
  | ErrorMessage
  | CompilerProgressMessage;

interface ProgressIndicatorProps {
  progress: number;
  currentPhase: string;
}

// Agregar componente de progreso
const ProgressIndicator: React.FC<ProgressIndicatorProps> = (
  { progress, currentPhase }
) => (
  <div className="flex items-center justify-center gap-2">
    <div className="flex items-center gap-1">
      <AnimatePresence mode="wait">
        {progress < 100 ? (
          currentPhase.includes("Escribiendo") ? (
            <motion.div
              key="pen"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Pen className="w-4 h-4 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="loader"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Loader size="xxs" mode="light" />
            </motion.div>
          )
        ) : (
          <motion.div
            key="check"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium md:truncate md:overflow-hidden md:whitespace-nowrap md:max-w-[350px] inline-block">
        {currentPhase}
      </span>
    </div>
    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
  </div>
);

export default function AgenteInvestigadorPage() {
  const { profile } = useAuth();
  const api = useApi();
  const { open: isSidebarOpen } = useSidebar();
  const [details, setDetails] = useState<ResearcherDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markdown, setMarkdown] = useState(markdownExample);
  const [isStartingResearch, setIsStartingResearch] = useState(false);
  const [messages, setMessages] = useState<Array<WebSocketMessage>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const phases = {
    research: ["Iniciando investigación", "Recuperando datos previos", "Generando consultas", "Realizando búsqueda", "Procesando resultados"],
    writing: ["Preparando contenido", "Generando secciones", "Finalizando documento"]
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const activeResearches = useMemo(() => ({
    primary: details?.primaryResearches.filter(r => r.status === 'active') || [],
    contributor: details?.contributorsResearches.filter(r => r.status === 'active') || []
  }), [details]);

  useEffect(() => {
    if (profile?.email) {
      loadResearcherDetails();
      connectWebSocket();
    }

    // Limpiar conexión cuando el componente se desmonta
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [profile?.email]);

  useEffect(() => {
    if (details) {
      const firstActiveAgent = activeResearches.primary[0]?.assignmentId || 
                             activeResearches.contributor[0]?.assignmentId || 
                             null;
      setSelectedAgentId(firstActiveAgent);
    }
  }, [details, activeResearches]);

  const loadResearcherDetails = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get<ResearcherDetails>(`/researchers-managements/researchers/details?email=${profile?.email}`);
      setDetails(data);
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

  const connectWebSocket = () => {
    const wserver = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8098/ws";
    const ws = new WebSocket(wserver);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket conectado');
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);

      switch (message.type) {
        case 'research_start':
          handleStartedMessage(message);
          break;
        case 'research_progress':
          handleProgressMessage(message);
          break;
        case 'writing_progress':
          handleWritingProgress(message);
          break;
        case 'compiler_progress':
          handleCompilerProgress(message);
          break;
        case 'error':
          handleError(message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Error en la conexión WebSocket');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket desconectado');
    };
  };

  const handleStartedMessage = (message: StartedMessage) => {
    setCurrentPhase(message.message);
    setProgress(0);
    if (message.data.status === 'started') {
      setIsStartingResearch(false);
    }
  }

  const handleProgressMessage = (message: ProgressMessage) => {
    setCurrentPhase(message.message);

    // Actualizar progreso basado en el mensaje
    const phaseIndex = phases.research.indexOf(message.message);
    if (phaseIndex !== -1) {
      setProgress((phaseIndex + 1) * (100 / phases.research.length));
    }
  };

  const handleWritingProgress = (message: WritingProgressMessage) => {
    switch (message.message) {
      case 'section_start':
        setCurrentPhase(`Escribiendo sección: ${message.data.section_name}`);
        break;
      case 'content_chunk':
        if (message.data.content) {
          setMarkdown(prev => prev + message.data.content);
        }
        break;
      case 'report_complete':
        setProgress(100);
        break;
    }
  };

  const handleError = (message: ErrorMessage) => {
    setError(message.data.error);
    toast.error(message.data.error);
  };

  const handleCompilerProgress = (message: CompilerProgressMessage) => {
    if (message.message === "final_report_chunk") {
      const { content } = message.data;

      setStreamingContent(prev => {
        const newContent = prev + content;
        setTimeout(scrollToBottom, 0);
        return newContent;
      });

      if (content) {
        setCurrentPhase("Generando contenido...");
      }
    }

    if (message.message === "final_report_complete") {
      const { is_complete } = message.data;
      if (is_complete) {
        setProgress(100);
        setMarkdown(streamingContent);
        setCurrentPhase("Investigación completada");
        setIsGenerationComplete(true);
      }
    }
  };

  const handleStartResearch = async () => {
    if (!details || !wsRef.current) return;

    setIsStartingResearch(true);

    try {
      // Enviar mensaje inicial al WebSocket
      const message = {
        type: "start_research",
        section_id: "test-section-1",
        title: selectedAgent?.name,
        description: selectedAgent?.description,
        assignment_id: selectedAgentId
      };

      wsRef.current.send(JSON.stringify(message));
    } catch (error) {
      toast.error("Error al iniciar la investigación");
    }
  };

  // Función para mantener el scroll en la parte inferior
  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  const getSelectedAgentDetails = () => {
    if (!details || !selectedAgentId) return null;

    const primaryAgent = details.primaryResearches.find(
      r => r.assignmentId === selectedAgentId
    );
    if (primaryAgent) {
      return {
        name: primaryAgent.agentName,
        description: primaryAgent.agentDescription,
        category: primaryAgent.agentCategory,
        industry: primaryAgent.agentIndustry,
        type: 'primary' as const
      };
    }

    const contributorAgent = details.contributorsResearches.find(
      r => r.assignmentId === selectedAgentId
    );
    if (contributorAgent) {
      return {
        name: contributorAgent.name,
        description: contributorAgent.shortDescription,
        category: contributorAgent.category,
        industry: contributorAgent.industry,
        type: 'contributor' as const
      };
    }

    return null;
  };

  const selectedAgent = getSelectedAgentDetails();

  const isTextareaReadOnly = () => {
    // Bloquear si:
    // 1. Hay contenido streaming y la generación no está completa
    // 2. La investigación está en progreso (progress > 0 y < 100)
    return (!!streamingContent && !isGenerationComplete) || (progress > 0 && progress < 100);
  };

  const handleSuccessDialogClose = () => {
    setMarkdown(markdownExample);
    setStreamingContent("");
    loadResearcherDetails();
  };

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
            Para comenzar tu investigación, primero debes registrarte como investigador.
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

  if (activeResearches.primary.length === 0 && activeResearches.contributor.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No tienes investigaciones activas</h2>
          <p className="text-muted-foreground max-w-md">
            Aquí no termina todo, puedes investigar un nuevo agente.
          </p>
        </div>
        <a
          href="/dashboard/documentation/nuevo-agente"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Investigar nuevo agente
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {details && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Tus agentes:</h2>
            <Select
              value={selectedAgentId || ''}
              onValueChange={(value) => setSelectedAgentId(value)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecciona un agente" />
              </SelectTrigger>
              <SelectContent>
                {activeResearches.primary.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Investigaciones Primarias
                    </div>
                    {activeResearches.primary.map((research) => (
                      <SelectItem key={research.assignmentId} value={research.assignmentId}>
                        {research.agentName}
                      </SelectItem>
                    ))}
                  </>
                )}
                {activeResearches.contributor.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Investigaciones Contribuidor
                    </div>
                    {activeResearches.contributor.map((research) => (
                      <SelectItem key={research.assignmentId} value={research.assignmentId}>
                        {research.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
        <CardContent
          className={`
            p-4
            flex
            flex-col
            justify-between
            items-start
            gap-4
            md:p-6
            ${isSidebarOpen ? 'lg:flex-col' : 'lg:flex-row'}
            ${isSidebarOpen ? 'lg:items-start' : 'lg:items-center'}
            ${isSidebarOpen ? 'lg:gap-4' : 'lg:gap-8'}
            xl:flex-row
            xl:items-center
            xl:gap-8
          `}
        >
          {/* User info */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="relative aspect-square w-16 h-16 overflow-hidden rounded-full ring-2 ring-primary/20">
              <Image
                src={details.avatarUrl}
                alt={details.name}
                fill
                priority
              />
            </div>
            <div>
              <h2 className="text-md md:text-2xl font-bold">¡Hola, {details.name}!</h2>
              <p className="text-sm md:text-lg text-muted-foreground">
                Estas documentando: {selectedAgent?.name}
              </p>
            </div>
          </div>

          {/* Status & Button */}
          <div
            className={`
              w-full
              flex
              flex-col
              items-start
              sm:w-auto
              ${isSidebarOpen
                ? 'lg:items-start lg:self-start'
                : 'lg:items-end lg:self-end'
              }
              xl:items-end
              xl:self-end
              transition-all
              duration-300
            `}
          >
            <div
              className={`
                flex
                items-center
                gap-2
                flex-row-reverse
                ${isSidebarOpen
                  ? 'lg:flex-row-reverse'
                  : 'lg:flex-row'
                }
                xl:flex-row
              `}
            >
              <span className="text-sm">{isConnected ? 'Conectado' : 'Desconectado'}</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="button"
                initial="enter"
                animate="center"
                exit="exit"
                variants={fadeSlideVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleStartResearch}
                    disabled={!isConnected || isStartingResearch || (!!currentPhase && progress < 100)}
                    className="mt-1 w-full sm:w-auto transition-opacity duration-200 disabled:opacity-30 hover:opacity-90"
                  >
                    <PlayCircle className={`w-4 h-4 ${isStartingResearch && 'animate-pulse'}`} />
                    {isStartingResearch ? 'Iniciando...' : 'Investigación con Agente'}
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!!currentPhase && progress < 100}
                    className="w-full sm:w-auto transition-opacity duration-200 hover:opacity-90 disabled:opacity-30"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Finalizar documentación
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
        {currentPhase && (
          <motion.div
            key="progress"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="!mt-0 rounded-tr-none rounded-tl-none overflow-hidden">
              <CardContent className="p-2">
                <ProgressIndicator
                  progress={progress}
                  currentPhase={currentPhase}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Card>
      
      {/* Editor y Preview */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa (GitHub)</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <Textarea
              ref={textareaRef}
              placeholder="Escribe tu investigación en markdown..."
              className="min-h-[600px] font-mono bg-card border-none focus-visible:ring-0"
              value={streamingContent || markdown}
              onChange={(e) => {
                if (isGenerationComplete) {
                  setStreamingContent(e.target.value);
                } else {
                  setMarkdown(e.target.value);
                }
              }}
              readOnly={isTextareaReadOnly()}
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                opacity: isTextareaReadOnly() ? '0.7' : '1',
                cursor: isTextareaReadOnly() ? 'not-allowed' : 'text'
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="rounded-lg border bg-card">
            <div className="markdown-preview p-6 min-h-[600px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {streamingContent || markdown}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detalles del Agente */}
      {selectedAgent && (
        <Card>
          <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:justify-between gap-4 md:gap-10 lg:gap-16">
            <div className="basis-auto">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
            </div>
            <div className="basis-auto">
              <h3 className="font-semibold mb-2">Categoría</h3>
              <p className="text-sm text-muted-foreground">{selectedAgent.category}</p>
            </div>
            <div className="basis-auto">
              <h3 className="font-semibold mb-2">Industria</h3>
              <p className="text-sm text-muted-foreground">{selectedAgent.industry}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicador de errores */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FinishDocumentationModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        assignmentId={selectedAgentId || ''}
        markdownContent={streamingContent || markdown}
        onSuccess={handleSuccessDialogClose}
      />
    </div>
  );
}
