"use client"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/ui/github"
import { LikeButton } from "@/components/ui/custom/shared/like-button"
import Link from "next/link"
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
  votes: number
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
    time: "06:00 PM",
    votes: 0
  },
  {
    id: "2",
    name: "ANDRÉS CAICEDO",
    avatarUrl: "https://avatars.githubusercontent.com/u/1103049?v=4",
    repositoryUrl: "https://github.com/JamiltonQuintero",
    linkedinUrl: "https://www.linkedin.com/in/andrescaicedom",
    role: "CTO - AI Enthusiast",
    presentation: "CrewAI",
    date: "21 Enero 2025",
    time: "06:00 PM",
    votes: 0
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
    time: "06:00 PM",
    votes: 0
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
    time: "06:00 PM",
    votes: 0
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
    time: "06:00 PM",
    votes: 0
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
      className="group relative h-full w-full overflow-hidden rounded-sm bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 -z-10" />

      <div className="relative aspect-square w-[40%] overflow-hidden rounded-full border-2 border-white/80 mx-auto mt-4">
        <Image
          src={researcher.avatarUrl}
          alt={researcher.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold text-white">{researcher.name}</span>
          <span className="font-medium text-xs opacity-80">{researcher.role}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-col items-center justify-center gap-2 text-xs text-white/80"
        >
          <span className="text-center font-bold">{researcher.presentation}</span>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{researcher.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{researcher.time}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-center gap-2"
        >
          <Button variant="outline" className="rounded-full" size="sm">
            <Link
              href={researcher.repositoryUrl}
              target="_blank"
              className="flex items-center gap-0.5"
            >
              <GithubIcon />
              <span className="text-xs font-light">GitHub</span>
            </Link>
          </Button>
          <LikeButton initialLiked={false} initialCount={researcher.votes} />
        </motion.div>
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