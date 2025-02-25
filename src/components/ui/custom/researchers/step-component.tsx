"use client";
import { UserCircle2, Target } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { forwardRef, useEffect, useRef } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
interface AgentSearchProps {
  onSelect: (value: string) => void;
}

export const AgentSearch = forwardRef<HTMLInputElement, AgentSearchProps>(
  ({ onSelect }, ref) => {
    return (
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <Command.Input 
            ref={ref}
            placeholder="Buscar agente..." 
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[200px] overflow-y-auto p-2">
          <Command.Empty>No se encontraron resultados.</Command.Empty>
          <Command.Group heading="Sugerencias">
            <Command.Item
              onSelect={() => onSelect("agent1")}
              className="cursor-pointer aria-selected:bg-accent"
            >
              Agente de Análisis de Datos
            </Command.Item>
            <Command.Item
              onSelect={() => onSelect("agent2")}
              className="cursor-pointer aria-selected:bg-accent"
            >
              Agente de Machine Learning
            </Command.Item>
            {/* Add more suggestions as needed */}
          </Command.Group>
        </Command.List>
      </Command>
    );
  }
);


interface StepComponentProps {
  sendMessage: (message: string) => void;
}

export const Welcome = ({ sendMessage }: StepComponentProps) => (
  <div className="space-y-4">
    <h3 className="text-[#5cbef8] font-mono">¿Qué te gustaría hacer?</h3>
    <div className="flex gap-4">
      <Button onClick={() => sendMessage("Create New Agent")}>
        Crear Nuevo Agente
      </Button>
      <Button onClick={() => sendMessage("View My Agents")}>
        Ver Mis Agentes
      </Button>
    </div>
  </div>
);

export const ResearcherTypeStep = ({ sendMessage }: StepComponentProps) => (
  <div className="space-y-4">
    <h3 className="text-[#5cbef8] font-mono">Selecciona el tipo de investigador</h3>
    <RadioGroup 
      onValueChange={(value) => sendMessage(value)} 
      className="space-y-3"
    >
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/30">
        <RadioGroupItem value="primary" id="primary" />
        <Label htmlFor="primary">Investigador Primario</Label>
      </div>
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/30">
        <RadioGroupItem value="contributor" id="contributor" />
        <Label htmlFor="contributor">Investigador Contribuidor</Label>
      </div>
    </RadioGroup>
  </div>
);

export const AgentSelectionStep = ({ sendMessage }: StepComponentProps) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add a small delay before focusing to ensure smooth animation
    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="text-[#5cbef8] font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Selecciona un agente
      </motion.h3>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <AgentSearch 
          onSelect={sendMessage} 
          ref={searchRef}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={() => sendMessage("No")}
          variant="outline"
          className="w-full mt-2"
        >
          Omitir
        </Button>
      </motion.div>
    </motion.div>
  );
};