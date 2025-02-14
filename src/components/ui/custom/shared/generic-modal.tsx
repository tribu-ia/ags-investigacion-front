import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "../../button";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
  confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary";
  cancelButtonText?: string;
  onCancel?: () => void;
  cancelButtonVariant?: "default" | "destructive" | "outline" | "secondary";
  headerClassName?: string;
  footerClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function GenericModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  confirmButtonText = "Confirmar",
  onConfirm,
  confirmButtonVariant = "default",
  cancelButtonText = "Cancelar",
  onCancel,
  cancelButtonVariant = "outline",
  headerClassName,
  footerClassName,
  size = "md",
}: GenericModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn("sm:max-w-[500px]", sizeClasses[size], className)}
      >
        {title && (
          <DialogHeader className={headerClassName}>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
        <DialogFooter className={footerClassName}>
          {cancelButtonText && (
            <Button variant={cancelButtonVariant} onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
          {confirmButtonText && (
            <Button variant={confirmButtonVariant} onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
