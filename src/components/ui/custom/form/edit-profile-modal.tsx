"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"

interface EditProfileModalProps {
  email: string;
  initialData: {
    currentRole: string;
    githubUsername: string;
    linkedinProfile: string;
  };
  onSuccess: () => void;
}

export function EditProfileModal({ email, initialData, onSuccess }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [updateForm, setUpdateForm] = useState(initialData)
  const api = useApi()

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      await api.put(
        `/researchers-managements/researchers/${email}/profile`,
        updateForm
      )
      
      setIsOpen(false)
      toast.success("Perfil actualizado correctamente")
      onSuccess()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/50 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentRole">Rol Actual</Label>
            <Input
              id="currentRole"
              value={updateForm.currentRole}
              onChange={(e) => setUpdateForm({ ...updateForm, currentRole: e.target.value })}
              placeholder="Ej: Desarrollador Full Stack"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUsername">Usuario de GitHub</Label>
            <Input
              id="githubUsername"
              value={updateForm.githubUsername}
              onChange={(e) => setUpdateForm({ ...updateForm, githubUsername: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinProfile">Perfil de LinkedIn</Label>
            <Input
              id="linkedinProfile"
              value={updateForm.linkedinProfile}
              onChange={(e) => setUpdateForm({ ...updateForm, linkedinProfile: e.target.value })}
              placeholder="https://linkedin.com/in/tu-perfil"
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? "Guardando cambios..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 