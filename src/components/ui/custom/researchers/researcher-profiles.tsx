"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Calendar, Clock, Github } from "lucide-react"

interface Researcher {
  id: string
  name: string
  avatarUrl: string
  repositoryUrl: string
  linkedinUrl: string
  role: string
  presentation: string
  date: string
  time: string
}

const researchers: Researcher[] = [
  {
    id: "1",
    name: "JAMILTON QUINTERO",
    avatarUrl: "https://avatars.githubusercontent.com/u/66916145?v=4",
    repositoryUrl: "https://github.com/JamiltonQuintero",
    linkedinUrl: "https://www.linkedin.com/in/jamilton-quintero-osorio/",
    role: "IA tecnical Manager",
    presentation: "N8N",
    date: "21 Enero 2025",
    time: "06:00 PM"
  },
  {
    id: "2",
    name: "ANDRÉS CAICEDO",
    avatarUrl: "https://avatars.githubusercontent.com/u/1103049?v=4",
    repositoryUrl: "https://github.com/JamiltonQuintero",
    linkedinUrl: "https://www.linkedin.com/in/andrescaicedom",
    role: "CTO Metrocuadrado",
    presentation: "CrewAI",
    date: "21 Enero 2025",
    time: "06:00 PM"
  },
  {
    id: "3",
    name: "ROGERT OVALLE",
    avatarUrl: "https://avatars.githubusercontent.com/u/19242676?v=4",
    repositoryUrl: "https://github.com/rogertovalle ",
    linkedinUrl: "https://www.linkedin.com/in/rogertovalle/",
    role: "AI Product Manager",
    presentation: "PydanticAI",
    date: "21 Enero 2025",
    time: "06:00 PM"
  },
  {
    id: "4",
    name: "ORLANDO KUAN",
    avatarUrl: "https://avatars.githubusercontent.com/u/58204194?v=4",
    repositoryUrl: "https://github.com/DarkCodePE",
    linkedinUrl: "https://www.linkedin.com/in/orlando-kuan-becerra-934356117/",
    role: "Researcher & AI Specialist",
    presentation: "GPT Researcher",
    date: "21 Enero 2025",
    time: "06:00 PM"
  },
  {
    id: "5",
    name: "JULIAN CASTRO",
    avatarUrl: "https://avatars.githubusercontent.com/u/75430955?v=4",
    repositoryUrl: "https://github.com/Jcasttrop",
    linkedinUrl: "https://linkedin.com/in/jcasttrop",
    role: "Data Scientist & Software Engineer",
    presentation: "LangChain",
    date: "21 Enero 2025",
    time: "06:00 PM"
  }
]

interface ResearcherCardProps {
  researcher: Researcher
  index: number
}

function ResearcherCard({ researcher, index }: ResearcherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="flex h-full flex-col items-center justify-center p-3">
        <div className="relative aspect-square w-[50%] overflow-hidden rounded-full border-4 border-white/80">
          <img
            src={researcher.avatarUrl}
            alt={researcher.name}
            className="h-full w-full object-cover p-2"
          />
        </div>
        
        <div className="mt-3 text-center">
          <h3 className="text-lg font-bold text-white">{researcher.name}</h3>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-1.5 space-y-1 text-sm text-white/80"
          >
            <p className="font-medium text-xs">{researcher.role}</p>
            <p className="text-xs opacity-80">{researcher.presentation}</p>
            
            <div className="mt-2 flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{researcher.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{researcher.time}</span>
              </div>
            </div>
            
            <a 
              href={researcher.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              <Github className="h-3 w-3" />
              <span>GitHub Profile</span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function ResearcherProfiles() {
  return (
    <div className="relative h-full w-full">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[50vh] w-[50vh] animate-pulse rounded-full bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-blue-500/20 blur-3xl" />
      </div>
      
      {/* Grid de investigadores */}
      <div className="relative h-full grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr">
        {researchers.map((researcher, index) => (
          <ResearcherCard key={researcher.id} researcher={researcher} index={index} />
        ))}
      </div>
    </div>
  )
} 