'use client';

import React, { useState } from 'react';
import { Terminal, Bot, Send, ArrowLeftRight } from 'lucide-react';
import { CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useActions } from 'ai/rsc';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './message';
import { SkeletonCards } from '../ui/skeleton-card';

interface ResourceAssistantProps {
  isExpanded: boolean;
  onToggleExpand: (state:boolean) => void;
}

export function ResourceAssistant({ isExpanded, onToggleExpand }: ResourceAssistantProps) {
  const { sendMessage } = useActions();
  const [messages, setMessages] = useState<Array<React.ReactNode>>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setMessages((messages) => [
      ...messages,
      <Message key={messages.length} role="user" content={input} />,
    ]);
    setInput('');

    try {
      const response = await sendMessage(input);
      setMessages((messages) => [...messages, response]);
      onToggleExpand(true) 
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Asistente de Aprendizaje
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
       
            className="lg:flex hidden"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="retro-card border border-border/50 rounded-lg p-6 bg-background/80 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <Bot className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="text-primary font-mono mb-2">¡Bienvenido! Puedo ayudarte con:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">›</span>
                      Explorar recursos de aprendizaje
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">›</span>
                      Crear rutas de aprendizaje personalizadas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">›</span>
                     ver el estado de mis agentes 
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {message}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <Bot size={24} className="text-primary" />
              <div className="flex items-center gap-2">
                <span className="text-sm">Procesando</span>
                <div className="flex gap-1">
                  { Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCards count={6} key={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className={`border-t pt-4 mt-4 ${isExpanded ? 'max-w-2xl mx-auto w-full' : ''}`}>
          <div className="flex gap-2">
            <motion.div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
             
                placeholder="¿Qué te gustaría aprender?"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={isProcessing}
                className="w-full"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSubmit} 
                disabled={isProcessing}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </>
  );
}