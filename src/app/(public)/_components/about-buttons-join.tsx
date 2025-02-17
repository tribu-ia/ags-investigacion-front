"use client"

import { Button } from "@/components/ui/button";
import { Github, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const AboutButtonsJoin = () => {
  const router = useRouter();

  return (
    <div className="grid gap-3">
      <Button
        onClick={() => router.push("/dashboard/documentation/nuevo-agente")}
      >
        Únete como Investigador
      </Button>
      <Button variant="outline" asChild>
        <Link
          href="https://github.com/tribu-ia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="size-5" />
          Explora el Repositorio
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link
          href="https://chat.whatsapp.com/Kxi3ftAYymLJ79YbYR6vXm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-5" />
          Únete al Chat
        </Link>
      </Button>
    </div>
  );
};
