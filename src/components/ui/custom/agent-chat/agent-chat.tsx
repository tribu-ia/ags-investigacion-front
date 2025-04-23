import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@ai-sdk/react";
import { useApi } from "@/hooks/use-api";
import { Message } from "./types";
import { UserMessage } from "./user-message";
import { AgentMessage } from "./agent-message";
import { LoadingMessage } from "./loading-message";
import { AgentSuggestionsMessage } from "./agent-suggestions-message";
import { useInvestigation } from "@/contexts/investigation-context";

import { useEffect, useState } from "react";
import { InvestigationProgressMessage } from "./agent-investigation-progress";
import { Card, CardContent } from "../../card";

// Hook para detectar si estamos en móvil
function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  return isMobile;
}

// Variantes para el contenedor de mensajes vacío
const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  },
};

// Tipos para los agentes cargados de API
type ResearchAgent = {
  assignmentId: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  status: string;
  agentName?: string;
  agentDescription?: string;
  agentCategory?: string;
  agentIndustry?: string;
  shortDescription?: string;
};

type ResearcherDetails = {
  name: string;
  email: string;
  avatarUrl: string;
  agentName: string;
  agentDescription: string;
  agentCategory: string;
  agentIndustry: string;
  primaryResearches: ResearchAgent[];
  contributorsResearches: ResearchAgent[];
};

// Actualizar el tipo Message para incluir toolInvocations
interface Message {
  id: string;
  type: "user" | "agent" | "loading";
  content: string;
  timestamp: Date;
  isNew: boolean;
  toolInvocations?: Array<{
    toolCallId: string;
    toolName: string;
    state: string;
    result?: any;
  }>;
}

// Componente para renderizar un mensaje individual
const MessageItem = ({
  message,
  onSelectAgent,
}: {
  message: Message;
  onSelectAgent: (agentId: string, agentName: string) => void;
}) => {
  // Renderizar diferentes tipos de mensajes según su tipo
  if (message.type === "loading") {
    return <LoadingMessage message={message} />;
  }
  if (message.type === "user") {
    return <UserMessage message={message} />;
  }

  // Procesar mensajes con invocaciones de herramientas
  if (message.type === "agent" && message.toolInvocations) {
    return (
      <div className="space-y-3">
        <AgentMessage message={{ ...message, content: message.content }} />
        {message.toolInvocations.map((tool) => {
          // Manejar diferentes tipos de invocaciones de herramientas
          if (
            tool.toolName === "startInvestigationProcess" &&
            tool.state === "result"
          ) {
            return (
              <InvestigationProgressMessage
                key={tool.toolCallId}
                stage={tool.result.stage}
              />
            );
          }
          if (
            tool.toolName === "displayAgentSuggestions" &&
            tool.state === "result"
          ) {
            return (
              <AgentSuggestionsMessage
                key={tool.toolCallId}
                suggestions={tool.result.suggestions}
                onSelectAgent={(agentId, agentName) => {
                  onSelectAgent(agentId, agentName);
                }}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }
  return <AgentMessage message={message} />;
};

// Añadir función para enviar respuesta al WebSocket
const sendWebSocketResponse = (ws: WebSocket, assignmentId: string, userFeedback: string) => {
  const message = {
    type: "user_response",
    user_feedback: userFeedback,
    assignmentId: assignmentId
  };
  ws.send(JSON.stringify(message));
};

export function AgentChat() {
  // Use the investigation context
  const {
    selectedAgentId,
    agentName,
    startInvestigation,
    isInvestigating,
    currentPhase,
    updateSelectedAgent,
    messageFeedback,
    setUserMessageFeedback,
  } = useInvestigation();

  const { profile } = useAuth();
  const api = useApi();
  const [isConnected] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  // Estado para los agentes activos
  const [activeResearches, setActiveResearches] = useState<{
    primary: ResearchAgent[];
    contributor: ResearchAgent[];
  }>({
    primary: [],
    contributor: [],
  });

  // Cargar los detalles del investigador al inicio
  useEffect(() => {
    const loadResearcherDetails = async () => {
      if (!profile?.email) return;
      try {
        const { data } = await api.get<ResearcherDetails>(
          `/researchers-managements/researchers/details?email=${profile.email}`
        );
        // Filtrar investigaciones activas
        setActiveResearches({
          primary:
            data.primaryResearches.filter((r) => r.status === "active") || [],
          contributor:
            data.contributorsResearches.filter((r) => r.status === "active") ||
            [],
        });
      } catch (error) {
        console.error("Error loading researcher details:", error);
      } finally {
      }
    };

    loadResearcherDetails();
  }, [profile?.email, api]);

  const {
    messages: aiMessages,
    input,
    setInput,
    handleSubmit,
    append,
    isLoading,
    error,
  } = useChat({
    id: `agent-chat-${selectedAgentId || "default"}`,
    body: {
      id: selectedAgentId,
      agentName,
      email: profile?.email ?? "",
      activeResearches: {
        primary: activeResearches.primary.map((r) => ({
          id: r.assignmentId,
          name: r.agentName || r.name,
          description: r.agentDescription || r.shortDescription,
          category: r.agentCategory || r.category,
          industry: r.agentIndustry || r.industry,
        })),
        contributor: activeResearches.contributor.map((r) => ({
          id: r.assignmentId,
          name: r.name,
          description: r.shortDescription,
          category: r.category,
          industry: r.industry,
        })),
      },
    },
    initialMessages: [],
    api: "/api/chat",
  });

  // Manejar la selección de agente (desde sugerencias del chat)
  const handleSelectAgent = (agentId: string, agentName: string) => {
    // Usar el método del contexto compartido para actualizar globalmente
    updateSelectedAgent(agentId, agentName);

    // Añadir mensaje de confirmación
    setTimeout(() => {
      append({
        role: "assistant",
        content: `He seleccionado el agente "${agentName}". ¿Quieres iniciar la investigación ahora?`,
      });
    }, 500);
  };

  // Convertir mensajes del formato AI SDK al formato usado por nuestros componentes
  const convertedMessages = React.useMemo(() => {
    return aiMessages.map((msg): Message => {
      if (msg.role === "user") {
        return {
          id: msg.id,
          type: "user",
          content: msg.content as string,
          timestamp: new Date(),
          isNew: false,
        };
      } else {
        return {
          id: msg.id,
          type: "agent",
          content: msg.content as string,
          timestamp: new Date(),
          isNew: false,
          toolInvocations: msg.toolInvocations,
        };
      }
    });
  }, [aiMessages]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const normalizedInput = input.toLowerCase().trim();

    // Si hay un mensaje de feedback activo, tratar la entrada como respuesta
    if (messageFeedback) {
      append({
        role: "user",
        content: input,
      });

      // Si el usuario escribe "continuar" o variaciones
      const continueResponses = ["continuar", "si", "sí", "ok", "seguir", "adelante"];
      const isContinue = continueResponses.some(resp => normalizedInput.includes(resp));

      if (isContinue) {
        // Enviar respuesta "continuar"
        if (wsRef.current && selectedAgentId) {
          sendWebSocketResponse(wsRef.current, selectedAgentId, "continuar");
        }
      } else {
        // Si no es continuar, enviar el texto como feedback
        if (wsRef.current && selectedAgentId) {
          sendWebSocketResponse(wsRef.current, selectedAgentId, input);
        }
      }

      setUserMessageFeedback(null); // Limpiar el mensaje de feedback
      setInput("");
      return;
    }

    // Resto de la lógica existente para otros tipos de mensajes
    const investigationStarters = [
      "iniciar investigacion",
      "iniciar investigación",
      "quiero iniciar mi investigacion",
      "quiero iniciar mi investigación",
      "continuar",
      "comenzar",
    ];

    const isInvestigationStart = investigationStarters.some((starter) =>
      normalizedInput.includes(starter)
    );

    if (!selectedAgentId) {
      append({
        role: "user",
        content: input,
      });

      setTimeout(() => {
        append({
          role: "assistant",
          content:
            "Para iniciar una investigación, primero debes seleccionar un agente desde el panel principal.",
        });
      }, 500);

      setInput("");
      return;
    }

    if (isInvestigationStart) {
      append({
        role: "user",
        content: input,
      });

      startInvestigation()
        .then(() => {
          append({
            role: "assistant",
            content: `Iniciando investigación con ${
              agentName || "el agente seleccionado"
            }...`,
          });
        })
        .catch((error) => {
          console.error("Error al iniciar investigación:", error);
          append({
            role: "assistant",
            content:
              "Ha ocurrido un error al iniciar la investigación. Por favor, intenta nuevamente.",
          });
        });

      setInput("");
      return;
    }

    handleSubmit(e);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convertedMessages]);

  useEffect(() => {
    const handleAgentChange = (event: CustomEvent) => {
      const { agentId, agentName } = event.detail;

      if (isInvestigating || isLoading) return;

      if (agentId !== selectedAgentId) {
        append({
          role: "assistant",
          content: `El agente de investigación ha cambiado a "${agentName}". ¿Quieres iniciar la investigación ahora?`,
        });
      }
    };

    window.addEventListener("agentChanged", handleAgentChange as EventListener);

    return () => {
      window.removeEventListener(
        "agentChanged",
        handleAgentChange as EventListener
      );
    };
  }, [selectedAgentId, isInvestigating, isLoading, append]);

  return (
    <AnimatePresence>
      <motion.div
        className={isMobile ? "fixed bottom-0 left-0 right-0 z-50 w-full" : ""}
        initial={isMobile ? { y: 0 } : { x: 500 }}
        animate={isMobile ? { y: isOpen ? 0 : "calc(100% - 64px)" } : { x: 0 }}
        exit={isMobile ? { y: "100%" } : { x: 500 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Sidebar
          collapsible="none"
          className={
            isMobile
              ? "w-full h-[80vh] border-t rounded-t-xl bg-gradient-to-tr from-[#24264A] from-10% via-[#24264A]/70 via-40% to-background to-90%"
              : "sticky hidden lg:flex top-0 h-svh w-[500px] max-w-[500px] bg-gradient-to-br from-[#24264A]/50 from-0% to-background/40 to-30%"
          }
        >
          <SidebarHeader
            className={`h-16 border-b border-[#24264A]/50 ${
              isMobile ? "cursor-pointer" : ""
            }`}
            onClick={isMobile ? () => setIsOpen(!isOpen) : undefined}
          >
            <div className="flex items-center gap-2 justify-between w-full px-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-[#24264A]"
                />
                <div className="flex flex-col">
                  <h2
                    className={
                      isMobile
                        ? "text-md font-semibold"
                        : "text-lg font-semibold"
                    }
                  >
                    Agente Investigador
                  </h2>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={
                        isMobile
                          ? "text-xs text-muted-foreground"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {isLoading || isInvestigating
                        ? currentPhase || "Procesando..."
                        : "Conectado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col p-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {convertedMessages.length === 0 ? (
                <motion.div
                  key="empty-state"
                  variants={emptyStateVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="rounded-full border-2 border-[#24264A] opacity-50 mb-4"
                    />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-semibold mb-2"
                    animate={{
                      color: ["#6366f1", "#8b5cf6", "#ec4899", "#6366f1"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    Agente Investigador
                  </motion.h3>
                  <motion.p
                    className="text-sm max-w-[80%]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {selectedAgentId
                      ? 'Escribe "iniciar investigación" para comenzar a investigar con el agente seleccionado.'
                      : 'Selecciona un agente desde el selector arriba, o escribe "mostrar agentes" para ver opciones disponibles.'}
                  </motion.p>
                </motion.div>
              ) : (
                <div className="flex flex-col space-y-4 w-full overflow-x-hidden">
                  {convertedMessages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      onSelectAgent={handleSelectAgent}
                    />
                  ))}
                  {messageFeedback && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="w-full"
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <p className="text-white">{messageFeedback}</p>
                            <p className="text-sm text-muted-foreground">
                              Escribe "continuar" para aprobar el plan o proporciona tus sugerencias de cambios escribiendo tu feedback.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />

                  {error && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Button
                        onClick={() => startInvestigation()}
                        disabled={!selectedAgentId || isLoading}
                        className="w-full max-w-md"
                      >
                        Iniciar Investigación con{" "}
                        {agentName || "Agente Seleccionado"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-[#24264A]/50">
            <motion.form
              className="flex items-center gap-2 w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onSubmit={onSubmitForm}
            >
              <Input
                placeholder={
                  isLoading || isInvestigating
                    ? "Procesando..."
                    : "Escribe tu mensaje..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmitForm(e);
                  }
                }}
                disabled={isLoading || isInvestigating}
                className="flex-1"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || isInvestigating || !input.trim()}
                  className="relative overflow-hidden"
                >
                  {isLoading || isInvestigating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4" />
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: "-100%" }}
                        animate={{ x: input.trim() ? "100%" : "-100%" }}
                        transition={{
                          duration: 1,
                          repeat: input.trim() ? Infinity : 0,
                          repeatDelay: 0.5,
                        }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </AnimatePresence>
  );
}
