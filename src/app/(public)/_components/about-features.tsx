import { Features } from "@/components/ui/features";
import { Brain, GitGraph, Pyramid, UsersRound } from "lucide-react";

const FEATURES = [
  {
    id: 1,
    title: "Investigación Colaborativa",
    content:
      "Explora y documenta agentes de IA junto a otros investigadores. Cada miembro estudia un agente y comparte sus hallazgos con la comunidad.",
    image: "/assets/agents.webp",
    icon: <UsersRound className="size-6 text-primary" />,
  },
  {
    id: 2,
    title: "Conocimiento Estructurado",
    content:
      "Accede a una base curada con más de 500 agentes de IA, documentación clara y ejemplos prácticos para facilitar el aprendizaje.",
    image: "/assets/structured_knowledge.webp",
    icon: <Pyramid className="size-6 text-primary" />,
  },
  {
    id: 3,
    title: "Desarrollo Open Source",
    content:
      "Contribuye a proyectos de código abierto y ayuda a construir los agentes del futuro con herramientas que benefician a toda la comunidad.",
    image: "/assets/open_source.webp",
    icon: <GitGraph className="size-6 text-primary" />,
  },
  {
    id: 4,
    title: "Aprendizaje e Innovación",
    content:
      "Desde principiantes hasta expertos, todos tienen un espacio. Participa en grupos de discusión, accede a materiales de apoyo y recibe mentoría.",
    image: "/assets/learning_innovation.webp",
    icon: <Brain className="size-6 text-primary" />,
  },
];

export const AboutFeatures = () => {
  return <Features data={FEATURES} />;
};
