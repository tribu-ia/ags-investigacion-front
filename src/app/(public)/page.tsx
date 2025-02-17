import { Stars } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HyperText } from "@/components/ui/hyper-text";
import { ReadyToJoin } from "./_components/ready-to-join";
import { StatsCounter } from "./_components/stats-counter";
import { CallToAction } from "./_components/call-to-action";
import { AboutFeatures } from "./_components/about-features";
import { AboutHowItWorks } from "./_components/about-how-it-works";
import { AboutButtonsJoin } from "./_components/about-buttons-join";
import { GitHubContributors } from "./_components/github-contributors";
import { NeuralBackground } from "@/components/ui/neural-background";

export default function Page() {
  return (
    <section className="max-md:[&>div[id]]:scroll-mt-12">
      <div className="border-grid border-b" id="welcome-community">
        <article className="container-wrapper relative overflow-hidden">
          <div className="container flex flex-col items-center py-10 md:py-14 text-center gap-14 relative z-10">
            <div className="flex flex-col gap-10 grow">
              <div className="flex flex-col gap-8 justify-center items-center text-center">
                <Badge
                  className="uppercase gap-1 cursor-default font-mono group text-sm"
                  variant="outline"
                >
                  <Stars className="size-4 text-primary group-hover:rotate-90 transition-all duration-200" />
                  Comunidad{" "}
                  <HyperText className="text-sm font-semibold p-0">
                    Open Source
                  </HyperText>
                </Badge>
                <h1 className="relative mx-0 max-w-[43.5rem] text-balance pt-5 text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-7xl md:mx-auto md:px-4 md:py-2 text-center md:text-7xl lg:text-7xl">
                  La Nueva Era Comienza{" "}
                  <span className="animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-blue-700">
                    Agentes IA
                  </span>
                </h1>
                <p className="max-w-2xl text-lg font-light text-foreground text-pretty text-center duration-700 animate-in fade-in-5 slide-in-from-top-2">
                  Únete a la comunidad hispana más grande de investigación en
                  agentes de IA. Exploramos, documentamos y construimos el
                  futuro de la inteligencia artificial juntos.
                </p>
                <CallToAction />
              </div>

              <StatsCounter />
            </div>
            <GitHubContributors />
          </div>

          <NeuralBackground className="size-full absolute inset-0 z-0" />
        </article>
      </div>

      <div className="border-grid border-b" id="what-we-do">
        <article className="container-wrapper">
          <div className="container flex flex-col items-center py-10 md:py-20 lg:py-40 gap-16">
            <div className="text-center space-y-1">
              <HyperText
                className="w-fit mx-auto text-sm text-primary font-mono font-medium tracking-wider uppercase cursor-default"
                as="h2"
              >
                ¿Qué hacemos?
              </HyperText>
              <h3 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-balance">
                Construyendo el Futuro de los Agentes IA
              </h3>
              <p className="max-w-2xl text-lg font-light text-foreground text-pretty text-center">
                Únete a una comunidad vibrante de investigadores,
                desarrolladores y entusiastas de la IA. Juntos, estamos
                documentando y construyendo la próxima generación de agentes
                inteligentes.
              </p>
            </div>
            <AboutFeatures />
          </div>
        </article>
      </div>

      <div className="border-grid border-b" id="how-it-works">
        <article className="container-wrapper">
          <div className="container flex flex-col items-center py-10 md:py-20 lg:py-40 gap-16">
            <div className="text-center space-y-1">
              <HyperText
                className="w-fit mx-auto text-sm text-primary font-mono font-medium tracking-wider uppercase cursor-default"
                as="h2"
              >
                ¿Cómo lo hacemos?
              </HyperText>
              <h3 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-balance">
                Cómo funciona la Investigación
              </h3>
              <p className="max-w-2xl text-lg font-light text-foreground text-pretty text-center">
                Nuestra metodología está diseñada para maximizar el aprendizaje
                colectivo y crear una base de conocimiento valiosa para toda la
                comunidad.
              </p>
            </div>
            <AboutHowItWorks />
          </div>
        </article>
      </div>

      <div className="border-grid border-b" id="find-your-agent">
        <article className="container-wrapper bg-primary/10">
          <div className="container flex flex-col items-center py-10 md:py-20 lg:py-48 gap-16">
            <div className="text-center space-y-1">
              <HyperText
                className="w-fit mx-auto text-sm text-primary font-mono font-medium tracking-wider uppercase cursor-default"
                as="h2"
              >
                ¿Listo para unirte?
              </HyperText>
              <h3 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-balance">
                Inicia tu Investigación
              </h3>
              <p className="max-w-2xl text-lg font-light text-foreground text-pretty text-center">
                Forma parte de nuestra comunidad de aprendices y contribuye al
                desarrollo de la IA. ¡Es hora de comenzar tu viaje!
              </p>
            </div>
            <ReadyToJoin />
          </div>
        </article>
      </div>

      <div className="border-grid border-b" id="get-started">
        <article className="container-wrapper">
          <div className="container flex flex-col items-center py-10 md:py-20 lg:py-40 gap-10">
            <div className="text-center space-y-1">
              <HyperText
                className="w-fit mx-auto text-sm text-primary font-mono font-medium tracking-wider uppercase cursor-default"
                as="h2"
              >
                ¿Por qué unirte?
              </HyperText>
              <h3 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-balance max-w-md mx-auto">
                Construye el Futuro siendo parte de los Agentes IA
              </h3>
              <p className="max-w-2xl text-lg font-light text-foreground text-pretty text-center">
                Ya sea como investigador, desarrollador o entusiasta, hay un
                lugar para ti en nuestra comunidad. Juntos estamos construyendo
                la mayor base de conocimiento en español sobre agentes de IA.
              </p>
            </div>
            <AboutButtonsJoin />
          </div>
        </article>
      </div>
    </section>
  );
}
