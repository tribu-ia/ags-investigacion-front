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
import Image from "next/image"
import { AgentSearch } from "@/components/ui/custom/agent-search"

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
  }).regex(/^\+?[0-9]{10,15}$/, "Por favor ingresa un número de teléfono válido (10-15 dígitos, puede incluir + al inicio)")
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tribu-back.pruebas-entrevistador-inteligente.site'

type ApiResponse = {
  status: string;
  message: string;
  data?: {
    success: boolean;
    message: string;
    error_type: string;
  }
}

export function ResearcherForm() {
  const [showQR, setShowQR] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshAgentKey, setRefreshAgentKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/investigadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      })

      const data: ApiResponse = await response.json()

      // Verificar si hay error en la respuesta
      if (data.data && !data.data.success) {
        throw new Error(data.data.message)
      }

      // Si todo está bien, limpiar el formulario y mostrar QR
      form.reset({
        agent: '',
        name: '',
        email: '',
        phone: ''
      })

      setRefreshAgentKey(prev => prev + 1)
      setShowQR(true)
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al enviar el formulario')
      
      // Si es un error de validación de correo, resaltar el campo
      if (error instanceof Error && error.message.includes('correo')) {
        form.setError('email', {
          type: 'manual',
          message: error.message
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                    Ingresa tu nombre completo
                  </FormDescription>
                  <FormControl>
                    <Input 
                      className="text-base px-4 py-2"
                      placeholder="Ej: Juan Pérez" 
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
                    Ingresa un correo electrónico válido
                  </FormDescription>
                  <FormControl>
                    <Input 
                      className="text-base px-4 py-2"
                      type="email"
                      placeholder="correo@ejemplo.com" 
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </Form>

        {showQR && (
          <div className="mt-8 border rounded-lg bg-white p-6 shadow-sm">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">
                Únete a nuestro Grupo de WhatsApp
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Escanea este código QR o haz clic en el enlace para unirte a nuestra comunidad de investigación
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Image
                    src="/QR.jpeg"
                    alt="Código QR de WhatsApp"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
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
                  
                  <a 
                    href="https://chat.whatsapp.com/Kxi3ftAYymLJ79YbYR6vXm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    Unirte al grupo de WhatsApp
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
