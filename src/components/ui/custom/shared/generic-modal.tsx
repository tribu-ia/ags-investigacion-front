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
  sm: "sm:max-w-[384px]",
  md: "sm:max-w-[500px]",
  lg: "sm:max-w-[680px]",
  xl: "sm:max-w-[768px]",
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
        className={cn(sizeClasses[size], className)}
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
