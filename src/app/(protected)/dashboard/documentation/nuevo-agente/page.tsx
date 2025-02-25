
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearcherForm } from "@/components/ui/custom/form/researcher-form";
import { LearnerForm } from "@/components/ui/custom/form/learner-form";
import { Card } from "@/components/ui/card";

import { FormAssistant } from "@/components/ui/custom/researchers/form-assistant";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import { AgentChat } from "@/components/ui/custom/researchers/AgentChat";
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export default function NuevoAgentePage() {
  const id = generateUUID();
  return (
    
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Investigar Nuevo Agente</h1>
        <p className="text-muted-foreground">
          Selecciona el tipo de investigación que deseas realizar
        </p>
      </div>
      <div className="grid gap-6">

          
           
        <AgentChat key={id} id={id} initialMessages={[]} />
           
          
      
    
      </div>
    </div>
   
  );
}
