"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import Loader from "@/components/ui/custom/shared/loader";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";
import "@/styles/github-markdown.css";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { FinishDocumentationModal } from "@/components/finish-documentation-modal";
import { useCoAgentStateRender, useLangGraphInterrupt } from "@copilotkit/react-core";
import { Progress } from "@/components/progress";

import { useStreamingContent } from '@/lib/hooks/useStreamingContent';
import N8nChat from "@/components/N8nChat";
import AgentChat from "@/components/ui/custom/agent-chat/agent-chat";
import { ResearchState } from "@/lib/types";
import { useResearch } from "@/contexts/investigation-context";
import { ProposalViewer } from "@/components/ui/custom/agent-chat/structure-proposal-viewer";
import SourcesModal from "@/components/ui/custom/agent-chat/resource-modal";
import { DocumentsView } from "@/components/ui/custom/agent-chat/agent-documents-view";

const CHAT_MIN_WIDTH = 30;
const CHAT_MAX_WIDTH = 50;

interface ResearcherDetails {
  primaryResearches: Array<{
    assignmentId: string;
    agentName: string;
    agentDescription: string;
    status: string;
  }>;
  contributorsResearches: Array<{
    assignmentId: string;
    name: string;
    shortDescription: string;
    status: string;
  }>;
}

const markdownExample = `## Introduction

Start writing your research here...`;

export default function AgenteInvestigadorPage() {
  const [chatWidth, setChatWidth] = useState(50) // Initial chat width in percentage
  const dividerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { state: researchState, setResearchState, selectedResearchId, runAgent, setSelectedResearchId, setActiveResearches } = useResearch()
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

   // Handle all "logs" - The loading states that show what the agent is doing
   useCoAgentStateRender<ResearchState>({
    name: 'agent',
    render: ({ state }) => {
        if (state.logs?.length > 0) {
            return <Progress logs={state.logs} />;
        }
        return null;
    },
}, [researchState]);

useLangGraphInterrupt({
    render: ({ resolve, event }) => {
        return <ProposalViewer
            // @ts-expect-error Expected runtime type is correct
            proposal={event.value}
            onSubmit={(approved, proposal) => resolve(
                JSON.stringify({
                    ...proposal,
                    approved,
                })
            )}
        />
    }
})

const streamingSection = useStreamingContent(researchState);

useEffect(() => {
    const divider = dividerRef.current
    const container = containerRef.current
    let isDragging = false

    const startDragging = () => {
        isDragging = true
        document.addEventListener('mousemove', onDrag)
        document.addEventListener('mouseup', stopDragging)
    }

    const onDrag = (e: MouseEvent) => {
        if (!isDragging) return
        const containerRect = container!.getBoundingClientRect()
        const newChatWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
        setChatWidth(Math.max(CHAT_MIN_WIDTH, Math.min(CHAT_MAX_WIDTH, newChatWidth))) // Limit chat width between 20% and 80%
    }

    const stopDragging = () => {
        isDragging = false
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDragging)
    }

    divider?.addEventListener('mousedown', startDragging)

    return () => {
        divider?.removeEventListener('mousedown', startDragging)
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDragging)
    }
}, [])

const {
    sections,
} = researchState

// Memoize the onSubmitMessage callback
const handleSubmitMessage = useCallback(async () => {
    setResearchState(prev => ({ ...prev, logs: [] }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (selectedResearchId) {
        runAgent();
    }
}, [setResearchState, selectedResearchId, runAgent]);

// Update research state when a research is selected, but only if it's different
useEffect(() => {
    if (selectedResearchId && researchState.activeResearchId !== selectedResearchId) {
        setResearchState(prev => ({
            ...prev,
            activeResearchId: selectedResearchId,
            logs: [] // Clear logs when switching research
        }));
        // Run the research agent when a topic is selected
        runAgent();
    }
}, [selectedResearchId, researchState.activeResearchId, setResearchState, runAgent]);



  return (
    <div
            className="h-screen bg-background text-[#3D2B1F] font-lato w-full">
            <div className="h-full border-black/10 border-y-0">
                {/* Main Chat Window */}
                <div className="flex h-full overflow-hidden flex-1" ref={containerRef}>
                    {/* Document Viewer */}
                    <DocumentsView
                        sections={sections ?? []}
                        streamingSection={streamingSection}
                        selectedSection={sections?.find(s => s.id === selectedSectionId)}
                        onSelectSection={setSelectedSectionId}
                    />

                    <div
                        ref={dividerRef}
                        className="w-1 bg-[#4fc3f7] hover:bg-[var(--primary)] cursor-col-resize flex items-center justify-center"
                    >
                        <GripVertical className="h-6 w-6 text-[var(--primary)]"/>
                    </div>
                    <div style={{width: `${chatWidth}%`}}>
                        <AgentChat onSubmitMessage={handleSubmitMessage} />
                    </div>
                </div>
            </div>
            <SourcesModal />
        </div>
  );
}
