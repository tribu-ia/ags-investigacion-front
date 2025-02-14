'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourceList } from './resource-list';
import { ResourceAssistant } from './resource-assistant';
import { Card } from '@/components/ui/card';
import { useActions } from 'ai/rsc';

export function ResourceGuideLayout() {
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const { messages } = useActions();
  console.log(messages);
  // Monitor messages to detect roadmap/learning path questions
  useEffect(() => {
   
    const lastMessage = messages?.[messages.length - 1];
    if (messages?.length > 0) {
      const content = lastMessage.content.toLowerCase();

      
      setIsAssistantExpanded(true);
    /*   if (
        content.includes('roadmap') ||
        content.includes('learning path') ||
        content.includes('path') ||
        content.includes('route') ||
        content.includes('guide me')
      ) {
        setIsAssistantExpanded(true);
      } */
  
    }
  }, [messages]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)]">
      <AnimatePresence initial={false}>
        {!isAssistantExpanded && (
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResourceList />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`${isAssistantExpanded ? 'w-full' : 'w-full lg:w-[400px]'}`}
        animate={{
          flex: isAssistantExpanded ? 1 : 'none',
          width: isAssistantExpanded ? '100%' : undefined
        }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full flex flex-col">
          <ResourceAssistant 
            isExpanded={isAssistantExpanded}
            onToggleExpand={() => setIsAssistantExpanded(!isAssistantExpanded)}
          />
        </Card>
      </motion.div>
    </div>
  );
}