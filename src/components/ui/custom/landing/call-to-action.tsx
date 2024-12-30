import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t border-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Únete a la Revolución de los Agentes IA
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Sé parte del futuro de la automatización inteligente. Comienza hoy
              mismo con nuestros agentes IA.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-6">
              Comienza Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6">
              Contacta con Ventas
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

