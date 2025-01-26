"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MisInvestigacionesPage() {
  const investigaciones = [
    {
      title: "Asistente de Análisis de Datos",
      status: "En Progreso",
      progress: 65,
      lastUpdate: "Hace 2 días",
      type: "IA Analítica",
    },
    {
      title: "Chatbot de Atención al Cliente",
      status: "Completado",
      progress: 100,
      lastUpdate: "Hace 1 semana",
      type: "NLP",
    },
    {
      title: "Sistema de Recomendaciones",
      status: "Planificación",
      progress: 25,
      lastUpdate: "Hoy",
      type: "Machine Learning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Progreso":
        return "bg-blue-500/10 text-blue-500";
      case "Completado":
        return "bg-green-500/10 text-green-500";
      case "Planificación":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mis Investigaciones</h1>
        <p className="text-muted-foreground">
          Gestiona y monitorea tus investigaciones en curso.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {investigaciones.map((inv, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{inv.type}</Badge>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    inv.status
                  )}`}
                >
                  {inv.status}
                </span>
              </div>
              <CardTitle className="text-xl">{inv.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{inv.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${inv.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Última actualización: {inv.lastUpdate}
                  </span>
                  <button className="text-primary hover:underline text-sm">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
