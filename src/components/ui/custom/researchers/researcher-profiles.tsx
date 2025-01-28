"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GithubIcon } from "@/components/ui/github"
import { LinkedinIcon } from "@/components/ui/linkedin"

interface Researcher {
  id: string
  name: string
  avatarUrl: string
  repositoryUrl: string
  linkedinUrl: string | null
  role: string
  presentation: string
  presentationDateTime: string
  date?: string
  time?: string
}

interface ResearcherResponse {
  weekStart: string
  weekEnd: string
  presentations: Researcher[]
}

interface ResearcherCardProps {
  researcher: Researcher
  index: number
}

const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr)
  const formattedDate = date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long'
  }).split(' ').map((word, index) => index === 2 ? word.replace(/^\w/, (c) => c.toUpperCase()) : word).join(' ')
  const formattedTime = date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  return {
    date: formattedDate,
    time: formattedTime
  }
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
        {/*Datos investigador*/}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold text-white">{researcher.name}</span>
          <span className="font-medium text-xs opacity-80">{researcher.role}</span>
        </motion.div>

        {/*Fecha y hora*/}
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
              <span>{researcher.time} COL (UTC-5)</span>
            </div>
          </div>
        </motion.div>

        {/*Redes sociales*/}
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

          {researcher.linkedinUrl && (
            <Button variant="outline" className="rounded-full" size="sm">
              <Link
                href={researcher.linkedinUrl}
                target="_blank"
                className="flex items-center gap-0.5"
              >
                <LinkedinIcon />
                <span className="text-xs font-light">LinkedIn</span>
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ResearcherProfiles() {
  const api = useApi()
  const [researchers, setResearchers] = useState<Researcher[]>([])
  const [weekEnd, setWeekEnd] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const { data } = await api.get<ResearcherResponse>('/researchers-managements/presentations/current-week')
        setResearchers(data.presentations)
        setWeekEnd(data.weekEnd)
      } catch (error) {
        console.error('Error fetching researchers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResearchers()
  }, [api])

  return (
    <div className="relative h-full w-full">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[50vh] w-[50vh] animate-pulse rounded-full bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-blue-500/20 blur-3xl" />
      </div>

      {/* Grid de investigadores */}
      <div className="relative h-full grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr">
        {researchers.map((researcher, index) => {
          const { date, time } = formatDateTime(researcher.presentationDateTime)
          return (
            <ResearcherCard
              key={researcher.id}
              researcher={{
                ...researcher,
                date,
                time
              }}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}
