"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation, type Variants } from "motion/react";
import CountUp from "react-countup";

const BASE_RUL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const API_ENDPOINT = "researchers-managements/agents/stats";

const pathVariants: Variants = {
  normal: {
    translateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
  animate: {
    translateX: [-6, 0],
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
};

const penVariants: Variants = {
  normal: {
    rotate: 0,
    x: 0,
    y: 0,
  },
  animate: {
    rotate: [-0.3, 0.2, -0.4],
    x: [0, -0.5, 1, 0],
    y: [0, 1, -0.5, 0],
    transition: {
      duration: 0.5,
      repeat: 1,
      ease: "easeInOut",
    },
  },
};

const botVariants: Variants = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 2,
    },
  },
}

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
  const controls = useAnimation();
  const controlsPen = useAnimation();
  const controlsBot = useAnimation();

  useEffect(() => {
    fetch(`${BASE_RUL}/${API_ENDPOINT}`)
      .then((response) => response.json())
      .then((data) => setStats(data));
  }, []);

  const handleMouseEnter = useCallback(() => {
    controls.start("animate");
  }, [controls]);

  const handleMouseLeave = useCallback(() => {
    controls.start("normal");
  }, [controls]);

  const handleMouseFilePen = useCallback(() => {
    controlsPen.start("animate");
  }, [controlsPen]);

  const handleMouseLeavePen = useCallback(() => {
    controlsPen.start("normal");
  }, [controlsPen]);

  const handleMouseBot = useCallback(() => {
    controlsBot.start("animate");
  }, [controlsBot]);

  const handleMouseLeaveBot = useCallback(() => {
    controlsBot.start("normal");
  }, [controlsBot]);

  return (
    <div className="grid gap-7 place-content-center md:grid-cols-6 md:flex-row text-center grow">
      <div
        className="flex flex-col items-center col-span-6 md:col-span-2"
        onMouseEnter={handleMouseBot}
        onMouseLeave={handleMouseLeaveBot}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <motion.path
            d="M15 13v2"
            variants={botVariants}
            animate={controlsBot}
          />
          <motion.path
            d="M9 13v2"
            variants={botVariants}
            animate={controlsBot}
          />
        </svg>
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
      <div
        className="flex flex-col items-center col-span-3 md:col-span-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <motion.path
            d="M22 21v-2a4 4 0 0 0-3-3.87"
            variants={pathVariants}
            animate={controls}
          />
          <motion.path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            variants={pathVariants}
            animate={controls}
          />
        </svg>
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
      <div
        className="flex flex-col items-center col-span-3 md:col-span-2"
        onMouseEnter={handleMouseFilePen}
        onMouseLeave={handleMouseLeavePen}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
        >
          <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
          <motion.path
            d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
            initial="normal"
            animate={controlsPen}
            variants={penVariants}
          />
          <motion.path
            d="M8 18h1"
            variants={{
              normal: { d: "M8 18h1" },
              animate: { d: "M8 18h5" },
            }}
            animate={controlsPen}
            transition={{ duration: 0.5 }}
          />
        </svg>
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
