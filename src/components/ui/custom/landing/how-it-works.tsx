"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Network, Cpu } from 'lucide-react'

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Cómo Funciona
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Un vistazo al proceso de nuestros agentes inteligentes
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden border-primary/20 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6">
                  <step.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Análisis Inteligente",
    description:
      "Los agentes analizan y comprenden las necesidades específicas de cada tarea.",
    icon: Brain,
  },
  {
    title: "Conexión en Red",
    description:
      "Colaboración entre agentes especializados para resolver problemas complejos.",
    icon: Network,
  },
  {
    title: "Procesamiento y Ejecución",
    description:
      "Ejecución precisa y eficiente de tareas con retroalimentación en tiempo real.",
    icon: Cpu,
  },
]

