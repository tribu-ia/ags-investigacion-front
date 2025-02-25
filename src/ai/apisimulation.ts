interface AgentRegistration {
    researcherType: string;
    agentId?: string;
  }
  
  export const simulateAgentRegistration = async (data: AgentRegistration): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: data.agentId 
        ? `Agente creado exitosamente con tipo ${data.researcherType} y agente ${data.agentId}`
        : `Agente creado exitosamente con tipo ${data.researcherType}`
    };
  };