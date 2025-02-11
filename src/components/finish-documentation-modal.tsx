import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

type FileWithPreview = {
  file: File;
  preview: string;
  progress?: number;
};

interface FinishDocumentationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinishDocumentationModal({
  isOpen,
  onOpenChange,
}: FinishDocumentationModalProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const newFileObjects = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFileObjects]);

    // Simular progreso de carga para cada archivo
    newFileObjects.forEach((fileObj, index) => {
      simulateFileUpload(files.length + index);
    });
  };

  const simulateFileUpload = (fileIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFiles((prev) =>
        prev.map((file, index) =>
          index === fileIndex ? { ...file, progress } : file
        )
      );
    }, 500);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Finalizar Documentación</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de finalizar la documentación?</p>
        <p className="text-sm text-muted-foreground">
          Tienes <span className="font-bold">{files.length}</span> archivos
          adjuntos.
        </p>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            mt-4 p-6 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-2
            transition-colors cursor-pointer
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }
          `}
        >
          <UploadCloud className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Arrastra y suelta archivos aquí o{" "}
            <label className="text-primary cursor-pointer hover:underline">
              busca en tu dispositivo
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInput}
              />
            </label>
          </p>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          Tamaño máximo total: 10MB
        </p>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Archivos adjuntos</h4>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="space-y-2 p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{file.file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Progress value={file.progress} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              toast.success("Documentación finalizada con éxito");
              onOpenChange(false);
            }}
          >
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
