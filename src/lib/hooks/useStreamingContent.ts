import { useEffect, useState } from 'react';
import { InvestigationState } from '@/contexts/investigation-context';

interface Section {
  id: string;
  title: string;
  content: string;
}

export function useStreamingContent(state: InvestigationState): Section | null {
  const [streamingSection, setStreamingSection] = useState<Section | null>(null);

  useEffect(() => {
    if (state.currentPhase && state.messageFeedback) {
      const newSection: Section = {
        id: `streaming-${Date.now()}`,
        title: state.currentPhase,
        content: state.messageFeedback
      };
      setStreamingSection(newSection);
    } else {
      setStreamingSection(null);
    }
  }, [state.currentPhase, state.messageFeedback]);

  return streamingSection;
} 