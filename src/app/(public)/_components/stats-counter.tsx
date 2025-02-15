"use client";

import { useEffect, useState } from "react";
import { Bot, BrainCircuit, UsersRound } from "lucide-react";
import CountUp from "react-countup";

const BASE_RUL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const API_ENDPOINT = "researchers-managements/agents/stats";

export const StatsCounter = () => {
  const [stats, setStats] = useState<{
    total_agents: number;
    documented_agents: number;
    active_investigators: number;
  }>({
    total_agents: 0,
    documented_agents: 0,
    active_investigators: 0,
  });

  useEffect(() => {
    fetch(`${BASE_RUL}/${API_ENDPOINT}`)
      .then((response) => response.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="grid gap-7 place-content-center md:grid-cols-6 md:flex-row text-center grow">
      <div className="flex flex-col items-center col-span-6 md:col-span-2">
        <Bot className="mb-3" size={32} />
        <CountUp
          className="text-4xl font-bold"
          start={0}
          end={stats.total_agents}
          duration={2.5}
        />
        <span className="text-sm text-muted-foreground">
          Agentes IA actuales
        </span>
      </div>
      <div className="flex flex-col items-center col-span-3 md:col-span-2">
        <UsersRound className="mb-3" size={32} />
        <CountUp
          className="text-4xl font-bold"
          start={0}
          end={stats.documented_agents}
          duration={2.5}
        />
        <span className="text-sm text-muted-foreground">
          Investigadores Activos
        </span>
      </div>
      <div className="flex flex-col items-center col-span-3 md:col-span-2">
        <BrainCircuit className="mb-3" size={32} />
        <CountUp
          className="text-4xl font-bold"
          start={0}
          end={stats.active_investigators}
          duration={2.5}
        />
        <span className="text-sm text-muted-foreground">
          Agentes Documentados
        </span>
      </div>
    </div>
  );
};
