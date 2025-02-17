"use client";

import { ResearcherForm } from "@/components/ui/custom/form/researcher-form";

export default function NuevoAgentePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Investigar Nuevo Agente</h1>
        <p className="text-muted-foreground">
          Selecciona el tipo de investigación que deseas realizar
        </p>
      </div>
      <div className="grid gap-6">

            <ResearcherForm />

      </div>
    </div>
  );
}
