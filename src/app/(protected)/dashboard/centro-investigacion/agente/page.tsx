"use client";

export default function AgenteInvestigadorPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Agente Investigador</h1>
        <p className="text-muted-foreground">
          Interactúa con nuestro agente de investigación inteligente.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4 h-[600px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-full">
            <span className="text-lg text-muted-foreground">Proximamente</span>
          </div>
          <div className="border-t pt-4">
            {/*<div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 min-h-10 rounded-md border bg-background px-3 py-2"
                    />
                    <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                      Enviar
                    </button>
              </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
