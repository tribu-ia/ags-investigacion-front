"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CallToAction = () => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center sm:flex-row justify-center gap-2">
      <Button
        className="rounded-[0.5rem]"
        onClick={() => router.push("/dashboard/documentation/nuevo-agente")}
      >
        Sé un Investigador
      </Button>
      <Button
        className="rounded-[0.5rem] hover:bg-accent-foreground/10"
        variant="ghost"
        onClick={() =>
          document
            .querySelector("#join-research")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Encuentra tu Agente
      </Button>
    </div>
  );
};
