
import { LearningPathView } from "@/components/resources/learning-path-view";
import { Message, TextStreamMessage } from "@/components/resources/message";
import { AgentMetricsView } from "@/components/resources/metrics";
import { ResourceItem } from "@/components/resources/resource-card";
import { data } from "@/lib/mocks";
import { Resource } from "@/types/resource";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";

// Column indices from the sheet structure
const COLUMN = {
  TITLE: 0,
  DESCRIPTION: 1,
  URL: 2,
  TYPE: 3,
  TOPIC: 4,
  TAGS: 5
};



async function transformSheetData(data: string[][]): Promise<Resource[]> {
  // Skip header row and transform data
  return data.slice(1).map((row, index) => ({
    id: `resource-${index}`,
    title: row[COLUMN.TITLE] || '',
    description: row[COLUMN.DESCRIPTION] || '',
    url: row[COLUMN.URL] || '',
    type: (row[COLUMN.TYPE] || 'documentación') as Resource['type'],
    topic: row[COLUMN.TOPIC] || 'General',
    tags: row[COLUMN.TAGS] ? 
      (typeof row[COLUMN.TAGS] === 'string' ? 
        row[COLUMN.TAGS].split(',').map(tag => tag.trim()) : 
        [row[COLUMN.TAGS]].filter(Boolean)
      ) : []
  }));
}

console.log(transformSheetData(data))

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai("gpt-4"),
    system: `\
      - you are a learning resource assistant
      - help users find appropriate learning materials
      - suggest learning paths based on user needs
      - reply in a professional and educational tone
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      viewResources: {
        description: "view resources for a specific topic",
        parameters: z.object({
          topic: z.string()
        }),
        generate: async function* ({ topic }) {
          const toolCallId = generateId();
          
          try {
      
     
            // Transform the raw data into resources
            const resources = data.slice(1).map((row: string[], index: number) => {
              const resource = {
                id: `resource-${index}`,
                title: row[COLUMN.TITLE] || '',
                description: row[COLUMN.DESCRIPTION] || '',
                url: row[COLUMN.URL] || '',
                type: row[COLUMN.TYPE] || 'documentación',
                topic: row[COLUMN.TOPIC] || 'General',
                tags: row[COLUMN.TAGS] ? 
                  (typeof row[COLUMN.TAGS] === 'string' ? 
                    row[COLUMN.TAGS].split(',').map(tag => tag.trim()) : 
                    [row[COLUMN.TAGS]].filter(Boolean)
                  ) : []
              };
             
              return resource;
            });

            // Filter resources by topic
            const topicResources = resources.filter(r => 
              r.topic.toLowerCase() === topic.toLowerCase()
            );

            messages.done([
              ...(messages.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "viewResources",
                    args: { topic },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "viewResources",
                    toolCallId,
                    result: `Found ${topicResources.length} resources for ${topic}`,
                  },
                ],
              },
            ]);

            if (topicResources.length === 0) {
              return (
                <Message 
                  role="assistant" 
                  content={`No encontré recursos para el tema "${topic}". ¿Te gustaría buscar otro tema?`}
                />
              );
            }

            return (
              <Message 
                role="assistant" 
                content={
                  <div className="space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Encontré {topicResources.length} recursos para {topic}:
                    </p>
                    <div className="grid gap-4">
                      {topicResources.map((resource) => (
                        <ResourceItem 
                          key={resource.id} 
                          resource={resource}
                        />
                      ))}
                    </div>
                  </div>
                }
              />
            );
          } catch (error) {
            console.error('Error fetching resources:', error);
            return (
              <Message
                role="assistant"
                content="Lo siento, hubo un error al buscar los recursos. Por favor, intenta nuevamente."
              />
            );
          }
        },
      },
      createLearningPath: {
        description: "create a learning path from resources",
        parameters: z.object({
          topic: z.string(),
          userLevel: z.string()
        }),
        generate: async function* ({ topic, userLevel }) {
          const toolCallId = generateId();
          
          try {
           
  
            const resources = await transformSheetData(data);
            
            const topicResources = resources.filter(r => r.topic === topic);
            const orderedTypes = ['guía', 'documentación', 'video', 'presentation'];
            
            const learningPath = {
              title: `Learning Path for ${topic}`,
              description: `Personalized path for ${userLevel} level`,
              steps: [
                {
                  title: "Getting Started",
                  resources: topicResources.filter(r => r.type === "guía"),
                  estimatedTime: "2 hours"
                },
                {
                  title: "Core Concepts",
                  resources: topicResources.filter(r => r.type === "documentación"),
                  estimatedTime: "3 hours"
                },
                {
                  title: "Practical Application",
                  resources: topicResources.filter(r => 
                    r.type === "video" || r.type === "presentation"
                  ),
                  estimatedTime: "4 hours"
                }
              ]
            };

            messages.done([
              ...(messages.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "createLearningPath",
                    args: { topic, userLevel },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "createLearningPath",
                    toolCallId,
                    result: `Created learning path for ${topic}`,
                  },
                ],
              },
            ]);

            return (
              <Message 
                role="assistant" 
                type="learning"
                content={<LearningPathView path={learningPath} />}
              />
            );
          } catch (error) {
            console.error('Error creating learning path:', error);
            return (
              <Message
                role="assistant"
             
                content="Sorry, I couldn't create the learning path at this moment."
              />
            );
          }
        },
      },
      // Add to your tools in actions.ts
viewAgentMetrics: {
  description: "view agent metrics and status",
  parameters: z.object({}),
  generate: async function* () {
    const toolCallId = generateId();

    const mockAgentMetrics = [
      {
        name: "LangChain Agent",
        progress: 75,
        status: "in_progress",
        updatedAt: "2h ago",
        type: "Framework Integration"
      },
      {
        name: "AutoGPT Agent",
        progress: 100,
        status: "completed",
        updatedAt: "1d ago",
        type: "Autonomous Agent"
      },
      {
        name: "GPT Researcher",
        progress: 30,
        status: "planning",
        updatedAt: "5h ago",
        type: "Research Assistant"
      }
    ];

    messages.done([
      ...(messages.get() as CoreMessage[]),
      {
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId,
            toolName: "viewAgentMetrics",
            args: {},
          },
        ],
      },
      {
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolName: "viewAgentMetrics",
            toolCallId,
            result: mockAgentMetrics,
          },
        ],
      },
    ]);

    return (
      <Message 
        role="assistant" 
        content={<AgentMetricsView metrics={mockAgentMetrics} />}
      />
    );
  },
}
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";
    if (done) {
      // save to database
    }
  },
});