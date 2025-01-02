"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

interface Researcher {
  id: string
  name: string
  image: string
  role: string
  presentation: string
  date: string
  time: string
}

const researchers: Researcher[] = [
  {
    id: "1",
    name: "ANDY",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    role: "Machine Learning Engineer",
    presentation: "Redes Neuronales Avanzadas",
    date: "20 Feb 2024",
    time: "10:00 AM"
  },
  {
    id: "2",
    name: "OLIVIA",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    role: "Data Scientist",
    presentation: "Análisis Predictivo",
    date: "20 Feb 2024",
    time: "11:00 AM"
  },
  {
    id: "3",
    name: "NOAH",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    role: "NLP Researcher",
    presentation: "Procesamiento de Lenguaje Natural",
    date: "20 Feb 2024",
    time: "12:00 PM"
  },
  {
    id: "4",
    name: "ELIJAH",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6",
    role: "AI Ethics Researcher",
    presentation: "Ética en IA",
    date: "20 Feb 2024",
    time: "2:00 PM"
  },
  {
    id: "5",
    name: "AVA",
    image: "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0",
    role: "Computer Vision Expert",
    presentation: "Visión por Computadora",
    date: "20 Feb 2024",
    time: "3:00 PM"
  },
  {
    id: "6",
    name: "HENRY",
    image: "https://images.unsplash.com/photo-1512663150964-d8f43c899f76",
    role: "Robotics Engineer",
    presentation: "Robótica Cognitiva",
    date: "20 Feb 2024",
    time: "4:00 PM"
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
            src={researcher.image}
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