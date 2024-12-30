"use client"

import { Users, Brain, BookOpen, Rocket, Share2, Code2 } from 'lucide-react'

const features = [
  {
    name: "Investigación Colaborativa",
    description: "Explora y documenta agentes de IA junto a otros investigadores. Cada miembro elige un agente, lo estudia y comparte sus hallazgos con la comunidad.",
    icon: Users,
  },
  {
    name: "Conocimiento Estructurado",
    description: "Accede a una base de conocimiento curada sobre más de 500 agentes de IA, con documentación clara y ejemplos prácticos.",
    icon: Brain,
  },
  {
    name: "Presentaciones Semanales",
    description: "Participa en sesiones semanales donde los investigadores comparten sus descubrimientos en presentaciones concisas de 10 minutos.",
    icon: BookOpen,
  },
  {
    name: "Desarrollo OpenSource",
    description: "Contribuye a proyectos de código abierto y ayuda a construir los agentes del futuro. Creamos herramientas que benefician a toda la comunidad.",
    icon: Code2,
  },
  {
    name: "Aprendizaje Continuo",
    description: "Desde principiantes hasta expertos, todos tienen un lugar. Grupos de discusión técnica, materiales de apoyo y mentoría disponible.",
    icon: Share2,
  },
  {
    name: "Innovación Constante",
    description: "Mantente a la vanguardia de la tecnología de agentes de IA. Explora nuevas ideas y desarrolla soluciones innovadoras.",
    icon: Rocket,
  },
]

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Construyendo el Futuro de los Agentes IA
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Únete a una comunidad vibrante de investigadores, desarrolladores y entusiastas de la IA.
              Juntos, estamos documentando y construyendo la próxima generación de agentes inteligentes.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature) => (
            <div key={feature.name} className="relative overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-b from-gray-900 to-black p-8">
              <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

