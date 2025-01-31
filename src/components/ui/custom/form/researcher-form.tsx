"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { AgentSearch } from "@/components/ui/custom/form/agent-search"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Clock, Github, Linkedin } from "lucide-react"

const formSchema = z.object({
  agent: z.string({
    required_error: "Por favor selecciona un agente",
  }).min(1, "Por favor selecciona un agente"),
  name: z.string({
    required_error: "El nombre es obligatorio",
  }).min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  email: z.string({
    required_error: "El correo electrónico es obligatorio",
  }).email("Por favor ingresa un correo electrónico válido"),
  phone: z.string({
    required_error: "El teléfono es obligatorio",
  }).regex(/^\+?[0-9]{10,15}$/, "Por favor ingresa un número de teléfono válido (10-15 dígitos, puede incluir + al inicio)"),
  github_username: z.string({
    required_error: "El usuario de GitHub es obligatorio",
  }).min(1, "Por favor ingresa tu usuario de GitHub"),
  linkedin_profile: z.string().optional(),
})

type ApiResponse = {
  status: string;
  message: string;
  data?: {
    success: boolean;
    message: string;
    error_type: string;
  }
}

type SuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    githubUsername: string;
    avatarUrl: string;
    repositoryUrl: string;
    linkedinProfile: string | null;
    agentId: string;
    status: string;
  };
  errorType: string | null;
  errorCode: string | null;
  presentationDateTime: string;
}

export function ResearcherForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null)
  const { profile } = useAuth()
  const api = useApi()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name || profile.preferred_username || "")
      form.setValue("email", profile.email || "")
    }
  }, [profile, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const formDataWithEmail = {
        ...values,
        email: profile?.email
      }

      const { data } = await api.post<SuccessResponse>('/researchers-managements/researchers', formDataWithEmail)

      if (!data.success) {
        throw new Error(data.message || 'Error al enviar el formulario')
      }

      setSuccessData(data)
      setShowSuccessModal(true)
      form.reset()
      setRefreshAgentKey(prev => prev + 1)
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Error al enviar el formulario'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <>
      <Card className="mt-4">
        <CardContent className="p-6">
          {errorMessage && (
            <div className="mb-4 p-4 border border-red-400 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path 
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M10 6.5V10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle 
                  cx="10" 
                  cy="13.5" 
                  r="0.5" 
                  fill="currentColor" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="agent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecciona un Agente de Investigación</FormLabel>
                    <FormControl>
                      <AgentSearch 
                        key={refreshAgentKey}
                        onSelect={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nombre Completo</FormLabel>
                    <FormDescription>
                      Nombre registrado en el sistema
                    </FormDescription>
                    <FormControl>
                      <Input 
                        className="text-base px-4 py-2 bg-muted"
                        placeholder="Ej: Juan Pérez" 
                        readOnly
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Correo Electrónico</FormLabel>
                    <FormDescription>
                      Correo registrado en el sistema
                    </FormDescription>
                    <FormControl>
                      <Input 
                        className="text-base px-4 py-2 bg-muted"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        readOnly
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Teléfono</FormLabel>
                    <FormDescription>
                      Formato: +57 300 123 4567
                    </FormDescription>
                    <FormControl>
                      <Input 
                        className="text-base px-4 py-2"
                        type="tel"
                        placeholder="+573001234567"
                        {...field}
                        onChange={(e) => {
                          // Permitir solo números y el signo +
                          const value = e.target.value.replace(/[^\d+]/g, '')
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github_username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Usuario de GitHub</FormLabel>
                    <FormDescription>
                      Tu nombre de usuario en GitHub
                    </FormDescription>
                    <FormControl>
                      <Input 
                        className="text-base px-4 py-2"
                        placeholder="usuario-github"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Perfil de LinkedIn</FormLabel>
                    <FormDescription>
                      URL de tu perfil de LinkedIn (opcional)
                    </FormDescription>
                    <FormControl>
                      <Input 
                        className="text-base px-4 py-2"
                        placeholder="https://linkedin.com/in/tu-perfil"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center">¡Bienvenido a TribuIA/Agentes! ahora eres un investigador</DialogTitle>
              <br />
          </DialogHeader>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Perfil del Investigador */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-6">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-32 overflow-hidden rounded-full border-4 border-white/80">
                  <img
                    src={successData?.data.avatarUrl}
                    alt={successData?.data.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">{successData?.data.name}</h3>
                  <p className="text-sm text-muted-foreground">Tu fecha TENTATIVA de presentación es:</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {successData?.presentationDateTime && 
                          formatDateTime(successData.presentationDateTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-4">
                    <p className="text-sm text-muted-foreground">Tus redes:</p>
                    <a
                      href={successData?.data.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    {successData?.data.linkedinProfile && (
                      <a
                        href={successData.data.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QR y Grupo de Discord */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <h4 className="text-lg font-semibold">
                Únete a nuestro Grupo de Discord
              </h4>
              <p className="text-sm text-muted-foreground text-center">
                Escanea este código QR o haz clic en el enlace para unirte a nuestra comunidad
              </p>
              
              <div className="relative">
                <Image
                  src="/QR.png"
                  alt="Código QR de Discord"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
              
              <a 
                href="https://discord.gg/VJzNePg4fB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600"
                >
                  <path
                    d="M3.9 12C3.9 10.29 4.29 8.6 5.07 7.04L3.82 3.93L7.02 5.18C8.57 4.4 10.27 4 12 4C16.97 4 21 8.03 21 13C21 17.97 16.97 22 12 22C7.03 22 3 17.97 3 13C3 12.66 3.03 12.33 3.07 12H3.9Z"
                    fill="currentColor"
                  />
                </svg>
                Unirte al grupo de Discord
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
