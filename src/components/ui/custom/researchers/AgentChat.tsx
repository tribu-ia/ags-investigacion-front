import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Bot, User, Plus, List, ArrowRight, CheckCircle, CircleDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentSelectionStep, ResearcherTypeStep } from "./step-component";

import { useAuth } from "@/hooks/use-auth";

import { DocumentationTemplate } from "./DocEditro";


import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const InvestigationProgressMessage = ({ stage }: { stage: string }) => {
  const [autoAdvanced, setAutoAdvanced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoAdvanced(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [stage]);

  const stages = ['initialize', 'data_collection', 'analysis', 'synthesis', 'complete'];
  const stageLabels = {
    'initialize': 'Iniciando investigación',
    'data_collection': 'Recopilando datos',
    'analysis': 'Analizando información',
    'synthesis': 'Sintetizando resultados',
    'complete': 'Investigación completada'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="w-full"
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-[#5cbef8]">Progreso de Investigación</h3>
          
          <div className="relative flex items-center justify-between">
            {/* Timeline line */}
            <div 
              className="absolute left-0 right-0 top-[14px] -z-10"
              style={{
                borderTop: '2px dashed #CBD5E1',
              }}
            />

            {stages.map((currentStage, index) => (
              <div key={currentStage} className="flex flex-col items-center relative">
                <div className="relative z-10">
                  {(stages.indexOf(currentStage) < stages.indexOf(stage) || 
                    (currentStage === 'initialize' && autoAdvanced)) ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : currentStage === stage ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <CircleDot className="w-6 h-6 text-[#5cbef8]" />
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-[#5cbef8]/20"
                      />
                    </motion.div>
                  ) : (
                    <CircleDot className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <span 
                  className={`
                    text-xs text-center mt-2
                    ${currentStage === stage 
                      ? 'text-[#5cbef8] font-medium' 
                      : (stages.indexOf(currentStage) < stages.indexOf(stage) || 
                         (currentStage === 'initialize' && autoAdvanced))
                        ? 'text-emerald-500'
                        : 'text-muted-foreground'}
                  `}
                >
                  {stageLabels[currentStage]}
                </span>
              </div>
            ))}
          </div>

          {stage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-4"
            >
              <Card className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Resultados</Badge>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                      Completado
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>¡Investigación finalizada con éxito!</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Análisis completo</li>
                      <li>• Resultados documentados</li>
                      <li>• Listo para revisión</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
interface SuccessMessageProps {
  message: string;
}

const SuccessMessage = ({ message }: SuccessMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-emerald-500/10 border-emerald-500/20">
      <CardContent className="p-4 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="h-6 w-6 text-emerald-500" />
        </motion.div>
        <span className="text-emerald-500 font-medium">{message}</span>
      </CardContent>
    </Card>
  </motion.div>
);

const suggestedActions = [
  {
    title: "Crear Nuevo Agente",
    label: "Iniciar proceso de creación",
    action: "Create New Agent",
    icon: Plus
  },
  {
    title: "Mis Agentes",
    label: "Ver tus agentes existentes",
    action: "View My Agents",
    icon: List
  },
];

export function AgentChat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
    const { profile } = useAuth();
    const { messages, handleSubmit, input, setInput, append, isLoading } = useChat({
      id,
      body: { id },
      initialMessages,
   
    api: "/api/chat",
    });
  
    // Track the current step and completion status
    const [currentStep, setCurrentStep] = useState<'creating' | 'documenting'>('');
    const [isCreatingCompleted, setIsCreatingCompleted] = useState(false);
    const [showDocumentation, setShowDocumentation] = useState(false);
    const [investigationProgress, setInvestigationProgress] = useState<string>('');
    const [streamedText, setStreamedText] = useState<string>('');
    const handleMessageSend = (message: string) => {
      append({
        role: "user",
        content: message,
      });
  
      // Only trigger creating step when selecting researcher type
      if (message === "primary" || message === "contributor") {
        setCurrentStep('creating');
        setIsCreatingCompleted(false);
      setShowDocumentation(false);
      }
      
   // Start investigation process
   if (message === "iniciar investigacion") {
    setCurrentStep("investigating")
    setInvestigationProgress("Iniciando el proceso de investigación...")
    setShowDocumentation(true)
    setStreamedText("done") // Reset streamed text

    // Send a message to start the investigation process
    append({
      role: "user",
      content: "Inicia el proceso de investigación",
    })
  }

    // After agent creation success (either skipping or selecting agent)
    if (message === "No" || message.startsWith("agent")) {
        // Mark creation as complete
        setIsCreatingCompleted(true);
        
        // First show success message
        setTimeout(() => {
          // Then show options message and enable documentation
          setShowDocumentation(true);
          append({
            role: "assistant",
            content: "¡Excelente! ¿Qué te gustaría hacer ahora? ¿Quieres iniciar la investigación con el último agente creado o prefieres ver todos tus agentes?"
          });
          // Show template after a brief delay
         
        }, 1500);
      }
    };
  
    useEffect(() => {
      // Update investigation progress and streamed text based on messages
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === "assistant" && lastMessage.toolInvocations) {
        const investigationTool = lastMessage.toolInvocations.find(
          (tool) => tool.toolName === "startInvestigationProcess",
        )
        if (investigationTool && investigationTool.state === "result") {
          setInvestigationProgress('Iniciando el proceso de investigación...')
         
        }
      }
    }, [messages])
  return (
    <div className="flex flex-row h-[calc(100vh-4rem)] bg-background">
      <motion.div 
        className="flex flex-col flex-1 p-4"
        animate={{ 
            width: showDocumentation ? '50%' : '100%'
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.length === 0 && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Welcome Card with Profile Info */}
                <Card className="border-2 border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-[#5cbef8]" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold text-foreground">
                          Bienvenido, {profile?.name || profile?.preferred_username || 'Usuario'}
                        </h2>
                        <p className="text-muted-foreground">{profile?.email}</p>
                        <p className="text-sm mt-2">¿En qué puedo ayudarte hoy?</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {suggestedActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card 
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleMessageSend(action.action)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <action.icon className="h-4 w-4 text-[#5cbef8]" />
                            <h3 className="font-medium font-mono">{action.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className="flex gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-[#5cbef8]" />
                  ) : (
                    <User className="h-4 w-4 text-[#5cbef8]" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="prose dark:prose-invert">
                    {message.content}
                  </div>

                  {message.role === "assistant" && message.toolInvocations?.map((tool) => {
                    if (tool.toolName === "displayResearcherTypes" && tool.state === "result") {
                      return (
                        <ResearcherTypeStep
                          key={tool.toolCallId}
                          sendMessage={handleMessageSend}
                        />
                      );
                    }
                    if (tool.toolName === "displayAgentSuggestions" && tool.state === "result") {
                      return (
                        <AgentSelectionStep
                          key={tool.toolCallId}
                          sendMessage={handleMessageSend}
                        />
                      );
                    }
                    if (tool.toolName === "createResearchAgent" && tool.state === "result" && tool.result.success) {
                      return (
                        <SuccessMessage
                          key={tool.toolCallId}
                          message={tool.result.message}
                        />
                      );
                    }
                     // Add new check for investigation stages
        if (tool.toolName === "startInvestigationProcess" && tool.state === "result") {
          return  <InvestigationProgressMessage stage={tool.result.stage} />;
        }
                    return null;
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
     
        <div className="border-t mt-4 pt-4">
          <form
            className="flex gap-2 max-w-2xl mx-auto"
            onSubmit={handleSubmit}
          >
            <Input
              value={input}
              placeholder={isLoading ? "Cargando..." : "Escribe tu mensaje..."}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
        </motion.div>
      
      {showDocumentation && (
        <motion.div 
          className="w-[40%] p-4 flex items-start h-full"
          initial={{ opacity: 0, x: 50, width: 0 }}
          animate={{ opacity: 1, x: 0, width: '40%' }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
        >
         <DocumentationTemplate investigationProgress={investigationProgress}
          streamedText={streamedText} />
        </motion.div>
      )}
      
    </div>
  );
}