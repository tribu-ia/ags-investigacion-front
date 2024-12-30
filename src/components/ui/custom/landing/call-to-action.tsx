"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, MessageCircle } from "lucide-react"

export function CallToAction() {
  return (
    <section id="call-to-action" className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Sé Parte del Futuro de los Agentes IA
            </h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ya sea como investigador, desarrollador o entusiasta, hay un lugar para ti en nuestra comunidad.
              Juntos estamos construyendo la mayor base de conocimiento en español sobre agentes de IA.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Únete como Investigador
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600/10">
              <Github className="mr-2 h-4 w-4" />
              Explora el Repositorio
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600/10">
              <MessageCircle className="mr-2 h-4 w-4" />
              Únete al Chat
            </Button>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm">
              ¿Nuevo en el mundo de los agentes? No te preocupes, tenemos recursos y mentores para ayudarte a comenzar.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a href="#" className="text-sm text-blue-500 hover:underline">Guía para Principiantes</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-sm text-blue-500 hover:underline">Recursos de Aprendizaje</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-sm text-blue-500 hover:underline">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

