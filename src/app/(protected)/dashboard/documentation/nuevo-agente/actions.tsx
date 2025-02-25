'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// AI Chat Function with Tools (Researcher & Agent Selection)
export async function continueConversation(history: Message[]) {
  'use server';

  const { text, toolResults } = await generateText({
    model: openai('gpt-4-turbo'), // Supports function calling
    system: 'You are an AI assistant helping users register as a researcher.',
    messages: history,
    tools: {
      selectResearcherType: {
        description: "Select the type of researcher",
        parameters: z.object({
          type: z.enum(["primary", "contributor"]).describe("Researcher type"),
        }),
        execute: async ({ type }) => {
          return {
            message: `You've selected to be a ${type} researcher.`,
            step: "researcher-type",
          };
        },
      },
      selectAgent: {
        description: "Select an agent to investigate",
        parameters: z.object({
          agentId: z.string().describe("Agent ID"),
          agentName: z.string().describe("Agent name"),
        }),
        execute: async ({ agentId, agentName }) => {
          return {
            message: `You've selected agent: ${agentName}.`,
            step: "agent-selection",
          };
        },
      },
      completeRegistration: {
        description: "Complete registration",
        parameters: z.object({
          researcherType: z.enum(["primary", "contributor"]),
          agentId: z.string().optional(),
        }),
        execute: async ({ researcherType, agentId }) => {
          return {
            message: `Registration completed! You are now a ${researcherType} researcher.`,
            step: "completed",
          };
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content:
          text || toolResults.map(toolResult => toolResult.result).join('\n'),
      },
    ],
  };
}
