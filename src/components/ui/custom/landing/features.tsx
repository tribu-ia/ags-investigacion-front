import { Brain, Globe2, Workflow, Zap, Shield, BarChart3 } from 'lucide-react'

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Características Revolucionarias
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Descubre el poder de los agentes IA y cómo están transformando la
              forma en que trabajamos.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
          {features.map((feature) => (
            <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-full flex-col justify-between rounded-md p-6">
                <feature.icon className="h-12 w-12 text-primary" />
                <div className="space-y-2 mt-4">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    title: "IA Avanzada",
    description:
      "Agentes potenciados por los últimos modelos de IA para ofrecer resultados excepcionales.",
    icon: Brain,
  },
  {
    title: "Conexión Global",
    description:
      "Red mundial de agentes que colaboran y comparten conocimientos en tiempo real.",
    icon: Globe2,
  },
  {
    title: "Automatización Inteligente",
    description:
      "Automatiza procesos complejos con agentes que aprenden y se adaptan.",
    icon: Workflow,
  },
  {
    title: "Velocidad Superior",
    description:
      "Respuestas instantáneas y procesamiento ultrarrápido para máxima eficiencia.",
    icon: Zap,
  },
  {
    title: "Seguridad Garantizada",
    description:
      "Protección de datos de nivel empresarial y cumplimiento normativo.",
    icon: Shield,
  },
  {
    title: "Análisis Avanzado",
    description:
      "Insights detallados sobre el rendimiento y la efectividad de los agentes.",
    icon: BarChart3,
  },
]

