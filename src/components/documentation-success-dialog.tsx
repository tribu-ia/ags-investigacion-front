import { GenericModal } from "@/components/ui/custom/shared/generic-modal";
import { GithubIcon } from "./ui/github";

interface DocumentationSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pullRequestUrl: string;
}

export function DocumentationSuccessDialog({
  isOpen,
  onOpenChange,
  pullRequestUrl,
}: DocumentationSuccessDialogProps) {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="¡Documentación Enviada con Éxito!"
      confirmButtonText="Entendido"
      onConfirm={() => onOpenChange(false)}
      cancelButtonText=""
      size="md"
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Tu documentación ha sido enviada correctamente, puedes revisarla en el siguiente enlace:
        </p>

        <div className="rounded-lg border p-4 bg-muted/50 relative">
          <div className="flex items-center justify-center bg-muted border border-muted-foreground/5 rounded-full p-2 absolute -top-4 -right-4">
            <GithubIcon />
          </div>
          <p className="text-sm font-medium mb-2">Pull Request creado en:</p>
          <a
            href={pullRequestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all flex items-center gap-2"
          >
            {pullRequestUrl}
          </a>
        </div>
      </div>
    </GenericModal>
  );
} 