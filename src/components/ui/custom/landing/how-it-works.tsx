"use client"

import { Search, FileText, PresentationIcon, GitBranch, Users2, Lightbulb } from 'lucide-react'

const steps = [
  {
    title: "Elige tu Agente",
    description: "Selecciona un agente de nuestro directorio curado con más de 500 opciones. Desde frameworks hasta productos completos, hay algo para cada interés.",
    icon: Search,
  },
  {
    title: "Investiga y Documenta",
    description: "Dedica dos semanas a explorar tu agente. Prueba sus capacidades, desarrolla ejemplos prácticos y documenta tus hallazgos siguiendo nuestras guías.",
    icon: FileText,
  },
  {
    title: "Comparte tus Hallazgos",
    description: "Presenta tus descubrimientos en sesiones semanales de 10 minutos. Comparte insights, código y casos de uso con otros investigadores.",
    icon: PresentationIcon,
  },
  {
    title: "Contribuye al Repositorio",
    description: "Añade tu documentación al repositorio común. Ayuda a construir una base de conocimiento sólida para la comunidad hispanohablante.",
    icon: GitBranch,
  },
  {
    title: "Únete a la Discusión",
    description: "Participa en grupos de discusión técnica, comparte ideas y aprende de otros investigadores. La comunidad crece con cada aportación.",
    icon: Users2,
  },
  {
    title: "Innova y Crea",
    description: "Utiliza el conocimiento adquirido para desarrollar nuevas soluciones. Contribuye a proyectos open source y ayuda a definir el futuro de los agentes IA.",
    icon: Lightbulb,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-[42rem] mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Cómo Funciona la Investigación
            </h2>
            <p className="text-gray-400 md:text-lg">
              Nuestra metodología está diseñada para maximizar el aprendizaje colectivo y crear una base de conocimiento valiosa para toda la comunidad.
            </p>
          </div>
        </div>
        <div className="mx-auto grid gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative overflow-hidden rounded-lg border border-gray-800 bg-black p-6 sm:p-8 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <step.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm text-blue-500 block mb-1">Paso {index + 1}</span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 flex-grow">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

