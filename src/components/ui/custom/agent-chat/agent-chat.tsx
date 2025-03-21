'use client'

import { CopilotChat } from "@copilotkit/react-ui";
// TODO: fix
// @ts-expect-error -- ignore
import { CopilotChatProps } from "@copilotkit/react-ui/dist/components/chat/Chat";
import { INITIAL_MESSAGE, MAIN_CHAT_INSTRUCTIONS, MAIN_CHAT_TITLE } from "../../../../lib/constants";
import { Send, RefreshCw, X, Bot } from "lucide-react";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { VoiceButton } from './voice-button';
import { useState } from 'react';

interface ExtendedCopilotChatProps extends CopilotChatProps {
  onSubmitMessage?: (message: string) => void;
}

export default function AgentChat({ ...props }: ExtendedCopilotChatProps) {



  const customStyles: CopilotKitCSSProperties = {
    "--copilot-kit-primary-color": "#4fc3f7",
    "--copilot-kit-contrast-color": "#0a192f",
    "--copilot-kit-secondary-color": "#5cbef8",
    "--copilot-kit-secondary-contrast-color": "#172a45",
    "--copilot-kit-background-color": "#0d1117",
    "--copilot-kit-muted-color": "#8892b0",
    "--copilot-kit-separator-color": "#1e2d3d",
    "--copilot-kit-scrollbar-color": "#4fc3f7",
    "--copilot-kit-response-button-color": "#e6f1ff",
    "--copilot-kit-response-button-background-color": "#1e4976",
  };

  return (
    <div style={customStyles} className="h-full ">
      <CopilotChat
        instructions={MAIN_CHAT_INSTRUCTIONS}
        labels={{
          title: MAIN_CHAT_TITLE,
          initial: INITIAL_MESSAGE,
        }}
        icons={{
          openIcon: <Bot className="text-[#4fc3f7]" />,
          closeIcon: <X className="text-[#4fc3f7]" />,
          sendIcon: <Send className="text-[#4fc3f7]" />,
          regenerateIcon: <RefreshCw className="text-[#4fc3f7]" />,
          spinnerIcon: (
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-[white] rounded-full"></div>
              <div className="h-2 w-2 bg-[white] rounded-full animation-delay-200"></div>
              <div className="h-2 w-2 bg-[white] rounded-full animation-delay-400"></div>
            </div>
          )
        }}
        className="h-full w-full font-mono rounded-md border border-[#1e2d3d] shadow-[0_0_15px_rgba(79,195,247,0.15)]"
       
      
        {...props}
      />
   
    </div>
  );
}