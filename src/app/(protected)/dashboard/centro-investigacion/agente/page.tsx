"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/shared/loader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import '@/styles/github-markdown.css';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Search, Pen } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Importaciones de plugins de markdown
const remarkGfm = require('remark-gfm');
const rehypeRaw = require('rehype-raw');
const rehypeSanitize = require('rehype-sanitize');

type ResearcherDetails = {
  name: string;
  email: string;
  avatarUrl: string;
  agentName: string;
  agentDescription: string;
  agentCategory: string;
  agentIndustry: string;
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
type ProgressMessage = {
  type: "progress";
  message: string;
  data: any;
};

type WritingProgressMessage = {
  type: "writing_progress";
  message: "section_start" | "content_chunk" | "section_complete" | "report_complete";
  data: {
    section_name?: string;
    content?: string;
    completed_sections?: string[];
  };
};

type CompleteMessage = {
  type: "complete";
  data: {
    message: string;
    section: {
      id: string;
      name: string;
      description: string;
      content: string;
      research: boolean;
      status: string;
    };
  };
};

type ErrorMessage = {
  type: "error";
  data: {
    error: string;
  };
};

type WebSocketMessage = ProgressMessage | WritingProgressMessage | CompleteMessage | ErrorMessage;

export default function AgenteInvestigadorPage() {
  const { profile } = useAuth();
  const api = useApi();
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
  const phases = {
    research: ["Iniciando investigación", "Recuperando datos previos", "Generando consultas", "Realizando búsqueda", "Procesando resultados"],
    writing: ["Preparando contenido", "Generando secciones", "Finalizando documento"]
  };

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
    const ws = new WebSocket('ws://localhost:8098/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket conectado');
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);

      switch (message.type) {
        case 'progress':
          handleProgressMessage(message);
          break;
        case 'writing_progress':
          handleWritingProgress(message);
          break;
        case 'complete':
          handleComplete(message);
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

  const handleProgressMessage = (message: ProgressMessage) => {
    setCurrentPhase(message.message);
    // Actualizar progreso basado en el mensaje
    const phaseIndex = phases.research.indexOf(message.message);
    if (phaseIndex !== -1) {
      setProgress((phaseIndex + 1) * (100 / phases.research.length));
    }
    toast.info(message.message);
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
      case 'section_complete':
        toast.success(`Sección completada: ${message.data.section_name}`);
        break;
      case 'report_complete':
        setProgress(100);
        toast.success("Documento completado");
        break;
    }
  };

  const handleComplete = (message: CompleteMessage) => {
    setProgress(100);
    setCurrentPhase("Completado");
    setMarkdown(message.data.section.content);
    toast.success(message.data.message);
  };

  const handleError = (message: ErrorMessage) => {
    setError(message.data.error);
    toast.error(message.data.error);
  };

  const handleStartResearch = async () => {
    if (!details || !wsRef.current) return;
    
    setIsStartingResearch(true);
    try {
      // Enviar mensaje inicial al WebSocket
      const message = {
        type: "start_research",
        section_id: "test-section-1",
        title: details.agentName,
        description: details.agentDescription
      };
      
      wsRef.current.send(JSON.stringify(message));
      toast.success("Investigación iniciada correctamente");
    } catch (error) {
      toast.error("Error al iniciar la investigación");
    } finally {
      setIsStartingResearch(false);
    }
  };

  // Agregar componente de progreso
  const ProgressIndicator = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {progress < 100 ? (
            currentPhase.includes("Escribiendo") ? (
              <Pen className="w-4 h-4 animate-pulse" />
            ) : (
              <Search className="w-4 h-4 animate-spin" />
            )
          ) : (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          <span className="text-sm font-medium">{currentPhase}</span>
        </div>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );

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

  return (
    <div className="space-y-6 p-6">
      {/* Header con información del investigador */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <img
              src={details.avatarUrl}
              alt={details.name}
              className="w-16 h-16 rounded-full ring-2 ring-primary/20"
            />
            <div>
              <h2 className="text-2xl font-bold">¡Hola, {details.name}!</h2>
              <p className="text-muted-foreground">
                Investigando: {details.agentName}
              </p>
            </div>
          </div>
        </CardContent>
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
              placeholder="Escribe tu investigación en markdown..."
              className="min-h-[600px] font-mono bg-card border-none focus-visible:ring-0"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleStartResearch}
              disabled={isStartingResearch || !markdown}
              className="gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              {isStartingResearch ? "Iniciando..." : "Iniciar Investigación"}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="rounded-lg border bg-card">
            <div className="markdown-preview p-6 min-h-[600px]">
              <ReactMarkdown>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detalles del Agente */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground">{details.agentDescription}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Categoría</h3>
              <p className="text-sm text-muted-foreground">{details.agentCategory}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Industria</h3>
              <p className="text-sm text-muted-foreground">{details.agentIndustry}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicador de conexión y progreso */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        
        {currentPhase && <ProgressIndicator />}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
