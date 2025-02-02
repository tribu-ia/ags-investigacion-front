'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { motion } from "framer-motion"
import LikeButton from '../shared/like-button'

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Bienvenidos a la revolución de los agentes autónomos de IA en 2025',
    description: 'Este martes 21 de enero, a las 6:00 p.m. (GMT-5), daré inicio a Tribu IA / Agentes, un programa diseñado para explorar lo mejor de los Agentes de IA',
    videoUrl: 'https://www.youtube.com/embed/dSjxbQ_Fl-0?si=GkmL1FsaBkqmIpOS',
    votes: 0
  },
  {
    id: '2',
    name: 'Tribu IA / Agentes - W2 - 1️⃣ Eidolon AI 2️⃣ PaperToPodcast 3️⃣ AutoGPT 4️⃣ Wordware 5️⃣F/MS Startup',
    description: 'Cada semana, cinco investigadores presentan un agente de nuestra base de más de 500 opciones. Este es el espacio perfecto si quieres organizar tus ideas y descubrir cómo aprovechar los agentes de IA en tu negocio o proyecto.',
    videoUrl: 'https://www.youtube.com/embed/6Vo1zuDJb8g?si=i3g25U-04aUKNxXn',
    votes: 0
  }
]

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)

  const handleVote = (projectId: string) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, votes: project.votes + 1 }
        : project
    ))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative w-full overflow-hidden rounded-sm bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-lg transition-all hover:shadow-lg hover:shadow-purple-500/20 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 -z-10" />

          {project.videoUrl && (
            <iframe
              src={project.videoUrl}
              className="w-full"
              allowFullScreen
            />
          )}

          <div className="h-full flex flex-col items-center justify-between gap-4 p-4">
            {/*Datos Proyecto*/}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span className="text-lg font-bold text-white leading-none">{project.name}</span>
              <span className="font-medium text-xs opacity-80">{project.description}</span>
            </motion.div>

            {/*Boton de votacion*/}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center gap-2"
            >
              <LikeButton
                initialCount={project.votes}
                initialLiked={project.votes > 0}
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}