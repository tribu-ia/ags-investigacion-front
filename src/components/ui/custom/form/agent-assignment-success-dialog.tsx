import { GenericModal } from "@/components/ui/custom/shared/generic-modal";
import { Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SuccessResponse } from "@/types/researcher";
import { DiscordIcon } from "@/components/ui/custom/icons/discord";
import { formatDateTime } from "@/lib/utils";

interface AgentAssignmentSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  successData: SuccessResponse | null;
}

const typeInvestigator = {
  PRIMARY: "Primario",
  CONTRIBUTOR: "Contribuidor",
};

export function AgentAssignmentSuccessDialog({
  isOpen,
  onOpenChange,
  successData,
}: AgentAssignmentSuccessDialogProps) {
  const router = useRouter();

  if (!successData) {
    return null;
  }

  const { data, researcher_type, presentationDateTime } = successData;
  const { avatarUrl, name } = data;
  return (
    <GenericModal
      isOpen={isOpen}
      title="Agente asignado correctamente!"
      onClose={() => onOpenChange(false)}
      onConfirm={() => onOpenChange(false)}
      confirmButtonText=""
      cancelButtonText=""
      size="lg"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-center">
              Investigador{" "}
              {
                typeInvestigator[
                  researcher_type as keyof typeof typeInvestigator
                ]
              }
            </h3>
            <div className="mt-4 relative aspect-square w-32 overflow-hidden rounded-full border-4 border-white/80">
              <Image
                src={avatarUrl}
                alt={name}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-center">{name}</h3>
              {presentationDateTime && (
                <div className="mt-2">
                  <p className="text-sm">Fecha tentativa de presentación:</p>
                  <p className="text-sm text-muted-foreground text-balance">
                    {formatDateTime(presentationDateTime)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {researcher_type === "PRIMARY" ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h4 className="text-lg font-semibold">Únete a nuestro Discord</h4>
            <Image
              src="/QR.png"
              alt="Discord QR"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
            <a
              href="https://discord.gg/VJzNePg4fB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <DiscordIcon className="h-5 w-5" />
              Unirte al grupo
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h4 className="text-lg font-semibold">Comienza a Documentar</h4>
            <p className="text-sm text-center text-muted-foreground">
              Accede al centro de investigación para comenzar a documentar
            </p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Button
                onClick={() => {
                  router.push("/dashboard/centro-investigacion/agente");
                  onOpenChange(false);
                }}
              >
                Ir al Centro de Investigación
              </Button>
              <a
                href="https://github.com/TribuAguirre/tribu-ia-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80"
              >
                <Github className="h-5 w-5" />
                Repositorio TribuIA
              </a>
            </div>
          </div>
        )}
      </div>
    </GenericModal>
  );
}
