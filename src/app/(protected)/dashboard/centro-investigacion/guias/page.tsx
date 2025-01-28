"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GuiasRecursosPage() {
  const recursos = [
    {
      title: "Guía de Inicio",
      description: "Aprende los conceptos básicos de la investigación con IA",
      category: "Principiante",
    },
    {
      title: "Mejores Prácticas",
      description:
        "Optimiza tus investigaciones siguiendo estas recomendaciones",
      category: "Intermedio",
    },
    {
      title: "Casos de Estudio",
      description: "Analiza casos reales de investigaciones exitosas",
      category: "Avanzado",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Guías y Recursos</h1>
        <p className="text-muted-foreground">
          Explora nuestra colección de recursos para mejorar tus habilidades de
          investigación.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recursos.map((recurso, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{recurso.title}</CardTitle>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {recurso.category}
                </span>
              </div>
              <CardDescription>{recurso.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <button className="text-primary hover:underline">
                Leer más →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
