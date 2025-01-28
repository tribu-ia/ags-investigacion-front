"use client";

import { ResearcherProfiles } from "@/components/ui/custom/researchers/researcher-profiles";

export default function EventosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Próximas Presentaciones</h1>
        <p className="text-muted-foreground">
          Conoce a los investigadores que presentarán sus avances este Martes!
        </p>
      </div>
      <div className="flex-1">
        <ResearcherProfiles />
      </div>
    </div>
  );
}
