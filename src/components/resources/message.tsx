'use client';

import { motion } from 'framer-motion';
import { Bot, User, Book, Code2, GraduationCap, Clock, Badge } from 'lucide-react';
import { ReactNode } from 'react';
import { StreamableValue, useStreamableValue } from 'ai/rsc';

// Message types supported by our chat
type MessageType = 'chat' | 'resource' | 'learning' | 'assessment';

interface MessageProps {
  role: "assistant" | "user";
  content: string | ReactNode;
  type?: MessageType;
  metadata?: {
    userLevel?: string;
    timeframe?: string;
    tags?: string[];
  };
}

// Icon mapping for different message types
const messageIcons = {
  chat: Bot,
  resource: Book,
  learning: GraduationCap,
  assessment: Code2,
};

// Component for handling streaming messages
export const TextStreamMessage = ({
  content,
  type = 'chat'
}: {
  content: StreamableValue;
  type?: MessageType;
}) => {
  const [text] = useStreamableValue(content);
  const Icon = messageIcons[type] || Bot;

  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-primary">
        <Icon />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Component for regular messages
export const Message = ({
  role,
  content,
  type = 'chat',
  metadata
}: MessageProps) => {
  const Icon = role === "assistant" ? (messageIcons[type] || Bot) : User;

  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-primary">
        <Icon />
      </div>
      <div className="flex flex-col gap-1 w-full">
        {/* Main message content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content}
        </div>

        {/* Optional metadata display */}
        {metadata && (
          <motion.div 
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {metadata.userLevel && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Level: {metadata.userLevel}</span>
              </div>
            )}
            {metadata.timeframe && (
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {metadata.timeframe}</span>
              </div>
            )}
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map((tag, index) => (
                  <Badge key={index}  className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Specialized message components for different types
export const ResourceMessage = (props: Omit<MessageProps, 'type'>) => (
  <Message {...props} type="resource" />
);

export const LearningMessage = (props: Omit<MessageProps, 'type'>) => (
  <Message {...props} type="learning" />
);

export const AssessmentMessage = (props: Omit<MessageProps, 'type'>) => (
  <Message {...props} type="assessment" />
);