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
import { Label } from "@/components/ui/label"
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

export function ResearcherForm() {
  const [showQR, setShowQR] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investigadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      setShowQR(true)
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="agent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecciona un Agente de Investigación</FormLabel>
                  <FormControl>
                    <AgentSearch onSelect={field.onChange} />
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
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Únete a nuestro Grupo de WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Escanea este código QR para unirte a nuestra comunidad de investigación
            </p>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Código QR de WhatsApp"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
