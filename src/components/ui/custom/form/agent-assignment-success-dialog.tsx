import { GenericModal } from "../shared/generic-modal"
import { Discord, Github } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SuccessResponse } from "@/types/researcher"

interface AgentAssignmentSuccessDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    successData: SuccessResponse | null;
}

export function AgentAssignmentSuccessDialog({
    isOpen,
    onOpenChange,
    successData
}: AgentAssignmentSuccessDialogProps) {
    const router = useRouter()

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={() => onOpenChange(false)}
            title="¡Asignación Exitosa!"
            confirmButtonText="Entendido"
            onConfirm={() => onOpenChange(false)}
            cancelButtonText=""
            size="lg"
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                    <p className="text-lg font-medium">El agente ha sido asignado correctamente.</p>
                    {successData && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Agente asignado: <span className="font-medium">{successData.data.agentId}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tipo de investigador: <span className="font-medium">{successData.researcher_type}</span>
                            </p>
                        </div>
                    )}
                </div>

                {successData?.researcher_type === "primary" ? (
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
                            <Discord className="h-5 w-5" />
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
                                    router.push('/dashboard/centro-investigacion/agente')
                                    onOpenChange(false)
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
    )
} 