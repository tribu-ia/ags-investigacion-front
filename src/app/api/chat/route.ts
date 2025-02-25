import { APICallError, convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";
import { openai} from "@ai-sdk/openai";

import {
  generateResearcherTypes,
  generateAgentSuggestions,
  createAgent,
  startInvestigation
} from "@/ai/actions";
import { error } from "console";


export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();
console.log(messages)
  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  if (APICallError.isInstance(error)) {
    // Handle the error
    console.log(error)
  }

  const result =  streamText({
    model: openai('gpt-3.5-turbo'),
     onError({ error }) {
    console.error(error); // your error logging logic here
  },
    system: `\n
        Eres un asistente amigable que ayuda a crear agentes de investigación de IA. Algunas pautas importantes:

        - Usa un tono conversacional y amigable en español
        - Cuando el usuario pregunte cómo empezar o crear un agente, responde brevemente y usa inmediatamente displayResearcherTypes
        - No menciones las funciones o herramientas en tus respuestas
        - Después de que el usuario seleccione un tipo, usa displayAgentSuggestions para mostrar las opciones
        - Mantén las respuestas concisas y naturales
        - Espera la selección del usuario antes de continuar
        - Evita listar opciones en texto, usa los componentes
        - Si el usuario escribe su elección, interprétala y procede normalmente
        - Para preguntas sobre cómo empezar, responde algo como "¡Claro! Primero elige el tipo de investigador que necesitas:" y muestra las opciones

        Flujo óptimo:
        1. Usuario pregunta cómo empezar -> Mostrar tipos de investigador
        2. Usuario selecciona tipo -> Mostrar opciones de agentes
        3. Usuario selecciona agente -> Confirmar y crear
    `,
    messages: coreMessages,
    tools: {
      displayResearcherTypes: {
        description: "Display available researcher types",
        parameters: z.object({}),
        execute: async () => {
          const result = await generateResearcherTypes();
          return result;
        },
      },
      displayAgentSuggestions: {
        description: "Display agent suggestions based on researcher type",
        parameters: z.object({
          researcherType: z.string().describe("Selected researcher type ID"),
        }),
        execute: async ({ researcherType }) => {
          const result = await generateAgentSuggestions({ researcherType });
          return result;
        },
      },
      createResearchAgent: {
        description: "Create a new research agent and show success message",
        parameters: z.object({
          researcherType: z.string().describe("Selected researcher type ID"),
          agentId: z.string().optional().describe("Selected agent ID (optional)"),
        }),
        execute: async ({ researcherType, agentId = 'default' }) => {
          const result = await createAgent({
            researcherType,
            agentId
          });
          
          return {
            success: result.success,
            message: `Agente "${result.agentId}" creado exitosamente como ${researcherType}`
          };
        },
      },
      // New tool for investigation process
      startInvestigationProcess: {
        description: "Start and manage the investigation process",
        parameters: z.object({
          agentId: z.string().describe("ID of the agent conducting the investigation"),
          investigationStage: z
            .enum(["initialize", "data_collection", "analysis", "synthesis", "complete"])
            .describe("Current stage of the investigation"),
        }),
        execute: async ({ agentId, investigationStage }) => {
          try {
            const investigationResult = await startInvestigation({
              agentId,
              stage: investigationStage,
            })

            const stageMessages = {
              initialize: "Iniciando proceso de investigación...",
              data_collection: "Recopilando datos relevantes...",
              analysis: "Analizando información y generando insights...",
              synthesis: "Sintetizando resultados de la investigación...",
              complete: "Investigación completada exitosamente.",
            }

            return {
              success: true,
              stage: investigationStage,
              message: stageMessages[investigationStage],
              details: investigationResult,
            }
          } catch (error) {
            console.error("Investigation process error:", error)
            return {
              success: false,
              message: "Error en el proceso de investigación",
              error: error instanceof Error ? error.message : "Unknown error",
            }
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();


}