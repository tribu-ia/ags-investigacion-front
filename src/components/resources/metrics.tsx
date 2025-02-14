'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { Terminal, GitCommit, GitPullRequest, Clock, Bot } from 'lucide-react';

interface AgentMetric {
  name: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'planning';
  updatedAt: string;
  type: string;
}

const castStatus = (status: string): 'in_progress' | 'completed' | 'planning' => {
  if (status === 'in_progress' || status === 'completed' || status === 'planning') {
    return status;
  }
  return 'planning';
};

export const AgentMetricsView = ({ metrics }: { metrics: AgentMetric[] }) => {
  const scale = scaleLinear().domain([0, 100]).range([0, 100]);

  const getStatusColor = (status: 'in_progress' | 'completed' | 'planning') => {
    switch (status) {
      case 'in_progress':
        return '#3B82F6'; // blue
      case 'completed':
        return '#10B981'; // green
      case 'planning':
        return '#F59E0B'; // yellow
    }
  };

  const getStatusIcon = (status: 'in_progress' | 'completed' | 'planning') => {
    switch (status) {
      case 'in_progress':
        return <GitCommit className="w-4 h-4" />;
      case 'completed':
        return <GitPullRequest className="w-4 h-4" />;
      case 'planning':
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-[500px] space-y-6">
      <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
        <Terminal className="text-[#5cbef8]" /> Mis_Agentes
      </h2>
      <div className="space-y-4">
        {metrics.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="retro-card border border-gray-700/50 rounded-lg p-4 bg-[#0a192f]/80 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#5cbef8] font-mono">{agent.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-mono text-sm">{agent.progress}%</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${getStatusColor(agent.status)}20`, color: getStatusColor(agent.status) }}>
                  {getStatusIcon(agent.status)}
                  <span>{agent.status.replace('_', ' ').charAt(0).toUpperCase() + agent.status.slice(1)}</span>
                </div>
              </div>
            </div>
            <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scale(agent.progress)}%` }}
                className="absolute h-full rounded-full"
                style={{ backgroundColor: getStatusColor(agent.status) }}
              />
              <motion.div
                className="absolute top-0 left-0 h-full"
                style={{ width: '4px', backgroundColor: getStatusColor(agent.status) }}
                animate={{ x: [0, scale(agent.progress), 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last update: {agent.updatedAt}
              </span>
              <span className="text-xs bg-gray-800/50 px-2 py-1 rounded-full">{agent.type}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
