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
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-[42rem] mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Construyendo el Futuro de los Agentes IA
            </h2>
            <p className="text-gray-400 md:text-lg">
              Únete a una comunidad vibrante de investigadores, desarrolladores y entusiastas de la IA.
              Juntos, estamos documentando y construyendo la próxima generación de agentes inteligentes.
            </p>
          </div>
        </div>
        <div className="mx-auto grid gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className="relative overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-b from-gray-900 to-black p-6 sm:p-8 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <feature.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.name}</h3>
                </div>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

