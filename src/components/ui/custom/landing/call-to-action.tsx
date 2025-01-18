"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function CallToAction() {
  const router = useRouter()
  return (
    <section id="call-to-action" className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-2 max-w-[42rem] mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Sé Parte del Futuro de los Agentes IA
            </h2>
            <p className="text-gray-400 md:text-lg">
              Ya sea como investigador, desarrollador o entusiasta, hay un lugar para ti en nuestra comunidad.
              Juntos estamos construyendo la mayor base de conocimiento en español sobre agentes de IA.
            </p>
          </div>
          
          <div className="flex flex-col w-full max-w-sm gap-4">
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push("/dashboard/documentation/nuevo-agente")}
            >
              Únete como Investigador
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-600/10"
              onClick={() => window.open('https://github.com/tribu-ia', '_blank')}
            >
              <Github className="mr-2 h-4 w-4" />
              Explora el Repositorio
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-600/10"
              onClick={() => window.open('https://chat.whatsapp.com/Kxi3ftAYymLJ79YbYR6vXm', '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Únete al Chat
            </Button>
          </div>
          
          <div className="w-full max-w-2xl mx-auto border-t border-gray-800 pt-8 mt-8">
            <p className="text-gray-400 text-sm mb-6">
              ¿Nuevo en el mundo de los agentes? No te preocupes, tenemos recursos y mentores para ayudarte a comenzar.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                Guía para Principiantes
              </a>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                Recursos de Aprendizaje
              </a>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

