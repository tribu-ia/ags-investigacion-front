"use client"

import { useState } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { InfoIcon } from "lucide-react"
import { AgentSearch } from "./agent-search"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"

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
  linkedin_profile: z.string({
    required_error: "El perfil de LinkedIn es obligatorio",
  }).min(1, "Por favor ingresa tu perfil de LinkedIn")
    .url("Por favor ingresa una URL válida de LinkedIn"),
})

interface NewResearcherFormProps {
  onSuccess: (data: any) => void;
  initialData?: {
    name: string;
    email: string;
  };
}

export function NewResearcherForm({ onSuccess, initialData }: NewResearcherFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const api = useApi()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      researcher_type: "contributor",
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: "",
      github_username: "",
      linkedin_profile: "",
      agent: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const response = await api.post('/researchers-managements/researchers', values)
      onSuccess(response.data)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setErrorMessage(error.response?.data?.message || "Error al enviar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        {errorMessage && (
          <div className="mb-4 p-4 border border-red-400 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <InfoIcon className="h-5 w-5 flex-shrink-0" />
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
                    URL de tu perfil de LinkedIn
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
  )
} 