// contexts/RegistrationContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';

type Step = 'introduction' | 'researcherType' | 'agentSelection' | 'completed';

interface RegistrationContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  formData: {
    name: string;
    email: string;
    researcherType?: 'primary' | 'contributor';
    agent?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<Step>('introduction');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const value = {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}