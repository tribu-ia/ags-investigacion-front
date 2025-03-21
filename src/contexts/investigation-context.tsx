'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react'
import type { ResearchState } from '@/lib/types'
import { useCoAgent } from "@copilotkit/react-core";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

interface ResearchContextType {
    state: ResearchState;
    setResearchState: (newState: ResearchState | ((prevState: ResearchState) => ResearchState)) => void
    sourcesModalOpen: boolean
    setSourcesModalOpen: (open: boolean) => void
    runAgent: () => void
    activeResearches: Array<{ id: string; title: string; description?: string }>
    setActiveResearches: (researches: Array<{ id: string; title: string; description?: string }>) => void
    selectedResearchId: string | null
    setSelectedResearchId: (id: string | null) => void
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined)

export function ResearchProvider({ children }: { children: ReactNode }) {
    const [sourcesModalOpen, setSourcesModalOpen] = useState<boolean>(false)
    const [activeResearches, setActiveResearches] = useState<Array<{ id: string; title: string; description?: string }>>([])
    const [selectedResearchId, setSelectedResearchId] = useState<string | null>(null)
    const { state: coAgentState, setState: setCoAgentsState, run } = useCoAgent<ResearchState>({
        name: 'agent',
        initialState: {},
    });
    const [localStorageState, setLocalStorageState] = useLocalStorage<ResearchState | null>('research', null);

    // Memoize the sync function to prevent unnecessary re-renders
    const syncState = useCallback(() => {
        const coAgentsStateEmpty = Object.keys(coAgentState).length < 1;
        const localStorageStateEmpty = localStorageState == null || Object.keys(localStorageState).length < 1;

        if (!localStorageStateEmpty && coAgentsStateEmpty) {
            setCoAgentsState(localStorageState);
        } else if (!coAgentsStateEmpty && localStorageStateEmpty) {
            setLocalStorageState(coAgentState);
        } else if (!localStorageStateEmpty && !coAgentsStateEmpty && JSON.stringify(localStorageState) !== JSON.stringify(coAgentState)) {
            setLocalStorageState(coAgentState);
        }
    }, [coAgentState, localStorageState, setCoAgentsState, setLocalStorageState]);

    // Use a ref to track if we've already synced
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!hasSynced.current) {
            syncState();
            hasSynced.current = true;
        }
    }, [syncState]);

    return (
        <ResearchContext.Provider value={{ 
            state: coAgentState, 
            setResearchState: setCoAgentsState as ResearchContextType['setResearchState'], 
            setSourcesModalOpen, 
            sourcesModalOpen, 
            runAgent: run,
            activeResearches,
            setActiveResearches,
            selectedResearchId,
            setSelectedResearchId
        }}>
            {children}
        </ResearchContext.Provider>
    )
}

export function useResearch() {
    const context = useContext(ResearchContext)
    if (context === undefined) {
        throw new Error('useResearch must be used within a ResearchProvider')
    }
    return context
}