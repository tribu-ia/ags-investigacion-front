import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import {
  FileStack,
  GitPullRequest,
  Lightbulb,
  Presentation,
  Search,
  UsersRound,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    title: "Elige tu Agente",
    description:
      "Selecciona un agente de nuestro directorio curado con más de 500 opciones. Desde frameworks hasta productos completos, hay algo para cada interés.",
    icon: <Search className="size-6 md:size-8 text-primary" />,
  },
  {
    title: "Investiga y Documenta",
    description:
      "Dedica dos semanas a explorar tu agente. Prueba sus capacidades, desarrolla ejemplos prácticos y documenta tus hallazgos siguiendo nuestras guías.",
    icon: <FileStack className="size-6 md:size-8 text-primary" />,
  },
  {
    title: "Comparte tus Hallazgos",
    description:
      "Presenta tus descubrimientos en sesiones semanales de 10 minutos. Comparte insights, código y casos de uso con otros investigadores.",
    icon: <Presentation className="size-6 md:size-8 text-primary" />,
  },
  {
    title: "Contribuye al Repositorio",
    description:
      "Añade tu documentación al repositorio común. Ayuda a construir una base de conocimiento sólida para la comunidad hispanohablante.",
    icon: <GitPullRequest className="size-6 md:size-8 text-primary" />,
  },
  {
    title: "Únete a la Discusión",
    description:
      "Participa en grupos de discusión técnica, comparte ideas y aprende de otros investigadores. La comunidad crece con cada aportación.",
    icon: <UsersRound className="size-6 md:size-8 text-primary" />,
  },
  {
    title: "Innova y Crea",
    description:
      "Utiliza el conocimiento adquirido para desarrollar nuevas soluciones. Contribuye a proyectos open source y ayuda a definir el futuro de los agentes IA.",
    icon: <Lightbulb className="size-6 md:size-8 text-primary" />,
  },
];

export const AboutHowItWorks = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-7 md:grid-cols-2 lg:grid-cols-3">
      {HOW_IT_WORKS.map((how, index) => (
        <div
          key={index}
          className="group relative grid overflow-hidden rounded-lg bg-secondary-foreground/5 shadow-sm border border-border ring-0 hover:border-primary hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary/50 transition-all duration-200"
        >
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.06}
            duration={3}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
          />
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-primary/10 to-50%" />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-primary/10 to-50%" />

            <div className="relative p-10 backdrop-blur-[2px] space-y-3">
              <div className="flex flex-row items-center gap-3 md:flex-col md:items-start">
                <div className="size-12 md:size-16 bg-primary/10 rounded-full shrink-0 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                  {how.icon}
                </div>
                <h2 className="mt-1 text-2xl/8 font-medium tracking-tight text-gray-950 dark:text-white">
                  {index + 1}. {how.title}
                </h2>
              </div>
              <p className="mt-2 max-w-[600px] text-base/6 text-muted-foreground">
                {how.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
