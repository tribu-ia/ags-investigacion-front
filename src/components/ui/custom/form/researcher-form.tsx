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
import { Calendar, Clock, Github, Linkedin, Discord } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { InfoIcon } from "lucide-react"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  agent: z.string({
    required_error: "Por favor selecciona un agente",
  }).min(1, "Por favor selecciona un agente"),
  researcher_type: z.enum(["primary", "contributor"], {
    required_error: "Por favor selecciona un tipo de investigador",
  }),
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
  researcher_type: "primary" | "contributor";
  presentationDateTime: string | null;
}

export function ResearcherForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null)
  const { profile } = useAuth()
  const api = useApi()
  const router = useRouter()
  
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

  const renderSuccessDialog = () => {
    if (!successData) return null;

    const isPrimaryResearcher = successData.researcher_type === "primary";

    return (
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              ¡Bienvenido a TribuIA/Agentes! - {isPrimaryResearcher ? 
                "Investigador Primario" : 
                "Investigador Contribuidor"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Lado izquierdo - Perfil */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-6">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-32 overflow-hidden rounded-full border-4 border-white/80">
                  <img
                    src={successData.data.avatarUrl}
                    alt={successData.data.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">{successData.data.name}</h3>
                  {successData.presentationDateTime && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Fecha tentativa de presentación:</p>
                      <p className="font-medium">{formatDateTime(successData.presentationDateTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lado derecho - Contenido específico según tipo */}
            {isPrimaryResearcher ? (
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
                      setShowSuccessModal(false)
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
        </DialogContent>
      </Dialog>
    );
  };

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
                name="researcher_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-base">Tipo de Investigador</FormLabel>
                      <HoverCard>
                        <HoverCardTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Tipos de Investigador</h4>
                            <div className="text-sm space-y-2">
                              <p>
                                <strong>Investigador Primario:</strong> Realiza presentaciones 
                                semanales y participa activamente en las sesiones de revisión.
                              </p>
                              <p>
                                <strong>Investigador Contribuidor:</strong> Aporta documentación 
                                a la plataforma sin compromiso de presentaciones.
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="primary" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Investigador Primario
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="contributor" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Investigador Contribuidor
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
      {renderSuccessDialog()}
    </>
  )
}
