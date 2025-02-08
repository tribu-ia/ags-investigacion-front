"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';

type ChallengeStatus = {
  currentMonth: number;
  isWeekOfUpload: boolean;
  isWeekOfVoting: boolean;
}

type ChallengeStatusContextType = {
  challengeStatus: ChallengeStatus | null;
  isLoading: boolean;
  error: string | null;
}

const ChallengeStatusContext = createContext<ChallengeStatusContextType | undefined>(undefined);

export function ChallengeStatusProvider({ children }: { children: React.ReactNode }) {
  const api = useApi();
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallengeStatus = async () => {
      try {
        const { data } = await api.get<ChallengeStatus>('/researchers-managements/agent-videos/challenge-status');
        setChallengeStatus(data);
      } catch (error) {
        console.error('Error loading challenge status:', error);
        setError('Error loading challenge status');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallengeStatus();
  }, [api]);

  return (
    <ChallengeStatusContext.Provider value={{ challengeStatus, isLoading, error }}>
      {children}
    </ChallengeStatusContext.Provider>
  );
}

export function useChallengeStatus() {
  const context = useContext(ChallengeStatusContext);
  if (context === undefined) {
    throw new Error('useChallengeStatus must be used within a ChallengeStatusProvider');
  }
  return context;
} 