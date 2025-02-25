"use client";
import { useChat } from "@ai-sdk/react";
import { Terminal, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Welcome, ResearcherTypeStep, AgentSelectionStep } from "@/components/ui/custom/researchers/step-component";

import { useState } from "react";

import { Message, continueConversation } from '@/app/(protected)/dashboard/documentation/nuevo-agente/actions';
import { readStreamableValue } from 'ai/rsc';
type StepType = "welcome" | "selectResearcherType" | "selectAgent" | "completed";

export function FormAssistant() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleOptionSelect = async (option: string, type?: string) => {
    setIsStreaming(true);

    let userMessage: Message;
    if (type === "researcher") {
      userMessage = { role: 'user', content: `Select researcher type: ${option}` };
    } else if (type === "agent") {
      userMessage = { role: 'user', content: `Select agent: ${option}` };
    } else {
      userMessage = { role: 'user', content: option };
    }

    setConversation(prev => [...prev, userMessage]);
    setInput('');

    const { messages } = await continueConversation([...conversation, userMessage]);

    let streamedResponse = '';

    for await (const delta of readStreamableValue(messages[messages.length - 1].content)) {
      streamedResponse += delta;
      setConversation(prev => [
        ...prev.slice(0, -1), // Remove previous message
        { role: 'assistant', content: streamedResponse }, // Update with streamed content
      ]);
    }

    setIsStreaming(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold">AI Research Assistant</h2>

      {/* Chat Messages */}
      <div className="mt-4 space-y-2">
        {conversation.map((message, index) => (
          <p key={index} className={message.role === 'user' ? 'text-blue-600' : 'text-gray-800'}>
            <strong>{message.role}:</strong> {message.content}
          </p>
        ))}
      </div>

      {/* Researcher Selection */}
      <div className="mt-4">
        <h3>Select Researcher Type:</h3>
        <button onClick={() => handleOptionSelect("primary", "researcher")} className="btn">Primary</button>
        <button onClick={() => handleOptionSelect("contributor", "researcher")} className="btn">Contributor</button>
      </div>

      {/* Agent Selection */}
      <div className="mt-4">
        <h3>Select an Agent:</h3>
        <button onClick={() => handleOptionSelect("001", "agent")} className="btn">Agent A</button>
        <button onClick={() => handleOptionSelect("002", "agent")} className="btn">Agent B</button>
      </div>

      {/* Text Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 flex-grow"
        />
        <button
          onClick={() => handleOptionSelect(input)}
          className="bg-blue-500 text-white px-4 py-2"
          disabled={isStreaming}
        >
          {isStreaming ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}