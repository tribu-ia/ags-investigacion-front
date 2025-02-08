"use client"

import { useEffect } from 'react';
import '@n8n/chat/style.css';
import '../styles/n8n-chat.css';
import { createChat } from '@n8n/chat';
import { useAuth } from '@/hooks/use-auth';

const N8nChat = () => {
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.email) {
      createChat({
        webhookUrl: 'https://primary-production-01a1.up.railway.app/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat',
        metadata: {
          userEmail: profile.email,
          userName: profile.name,
          sessionId: profile.email,
          timestamp: new Date().toISOString(),
          consultDate: new Date().toLocaleDateString(),
          consultTime: new Date().toLocaleTimeString()
        },

        target: '#n8n-chat',
        showWelcomeScreen: true,
        initialMessages: [
          `¡Hola! ${profile.name} 👋`,
          '¿Qué dudas tienes hoy sobre las charlas de agentes IA? de las semanas pasadas?',
          '¿En qué puedo ayudarte hoy?'
        ],
        i18n: {
          en: {
            title: 'Asistente Tribu IA / Agentes',
            subtitle: '',
            inputPlaceholder: 'Escribe tu consulta...',
            getStarted: 'Comenzar chat',
            closeButtonTooltip: 'Cerrar chat'
          },
        },
        theme: {
          button: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          },
          chat: {
            backgroundColor: 'hsl(var(--background))',
            textColor: 'hsl(var(--foreground))'
          },
          userMessage: {
            backgroundColor: 'hsl(var(--primary))',
            textColor: 'hsl(var(--primary-foreground))'
          },
          botMessage: {
            backgroundColor: 'hsl(var(--muted))',
            textColor: 'hsl(var(--muted-foreground))'
          }
        }
      });
    }
  }, [profile]);

  return <div id="n8n-chat"></div>;
};

export default N8nChat; 