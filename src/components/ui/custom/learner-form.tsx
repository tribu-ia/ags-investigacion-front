"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import DOMPurify from 'isomorphic-dompurify'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { AgentResult } from "./agent-result"

// Función para sanitizar el input
const sanitizeInput = (input: string): string => {
  // Eliminar cualquier HTML
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No permitir ninguna etiqueta HTML
    ALLOWED_ATTR: [], // No permitir ningún atributo
  })
  
  // Eliminar caracteres especiales y limitar a caracteres seguros
  return sanitized
    .replace(/[<>{}]/g, '') // Eliminar caracteres peligrosos
    .replace(/[^\w\s.,!?¿¡áéíóúÁÉÍÓÚñÑ-]/g, '') // Solo permitir letras, números y puntuación básica
    .trim()
}

const formSchema = z.object({
  useCase: z.string()
    .min(10, "Por favor, describe tu caso de uso en al menos 10 caracteres.")
    .max(1000, "La descripción no puede exceder los 1000 caracteres.")
    .transform(sanitizeInput) // Sanitizar el input
    .refine(
      (val) => !/[<>{}]/.test(val), 
      "El texto contiene caracteres no permitidos"
    )
})

type AgentData = {
  id: string
  name: string
  description: string
  category: string
  industry: string
  keyFeatures: string[]
  useCases: string[]
  tags: string[]
}

export function LearnerForm() {
  const [agentResults, setAgentResults] = useState<AgentData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Sanitizar el input antes de enviarlo
      const sanitizedQuery = sanitizeInput(values.useCase)
      
      // Verificar que el input sanitizado no esté vacío
      if (!sanitizedQuery.trim()) {
        throw new Error("El texto ingresado no es válido")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query/hybrid-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: sanitizedQuery,
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }

      const data = await response.json()
      
      // Validar la respuesta del servidor
      if (!Array.isArray(data.results)) {
        throw new Error('Formato de respuesta inválido')
      }

      // Process and transform the data
      const transformedResults = data.results
        .slice(0, 3)
        .map((result: any) => {
          const metadata = result[0]?.metadata || {}
          const content = result[0]?.page_content || ''
          
          // Sanitizar también el contenido recibido
          const sanitizedContent = sanitizeInput(content)
          
          // Extract key features, use cases, and tags from the content safely
          const keyFeatures = sanitizedContent.match(/Key Features: (.+)/)?.[1]?.split(', ') || []
          const useCases = sanitizedContent.match(/Use Cases: (.+)/)?.[1]?.split(', ') || []
          const tags = metadata.tags || []

          return {
            id: metadata.id || '',
            name: sanitizeInput(metadata.name || ''),
            description: sanitizeInput(metadata.description || ''),
            category: sanitizeInput(metadata.category || ''),
            industry: sanitizeInput(metadata.industry || ''),
            keyFeatures: keyFeatures.map(sanitizeInput),
            useCases: useCases.map(sanitizeInput),
            tags: tags.map(sanitizeInput),
          }
        })

      setAgentResults(transformedResults)
    } catch (error) {
      console.error('Error:', error)
      // Mostrar un mensaje de error al usuario
      form.setError('useCase', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Error en la búsqueda'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encuentra tu Agente Perfecto</CardTitle>
        <CardDescription>Cuéntanos tu caso de uso y te ayudaremos a encontrar el agente ideal para ti.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="useCase"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe lo que estás necesitando. Por ejemplo: Quiero un agente que me ayude a analizar datos de ventas y generar informes semanales..."
                      {...field}
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Consultar'}
            </Button>
          </form>
        </Form>

        {agentResults.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold">Agentes Recomendados</h3>
            {agentResults.map((agent) => (
              <AgentResult key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
