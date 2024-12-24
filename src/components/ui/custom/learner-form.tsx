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
// Definir una URL base que use la variable de entorno o un fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tribu-back.pruebas-entrevistador-inteligente.site'

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

// Actualizar el tipo AgentData para reflejar la estructura real
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

// Tipo para la respuesta de la API
type APIResponse = {
  results: Array<[{
    metadata: {
      id: string
      name: string
      category: string
      industry: string
      shortDescription: string
      keyFeatures: string
      useCases: string
      tags: string
    }
    page_content: string
  }, number]>
}

// Función auxiliar para procesar tags
const processTags = (tags: string | string[] | null | undefined): string[] => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(sanitizeInput)
  return tags.split(',').map(tag => sanitizeInput(tag.trim()))
}

export function LearnerForm() {
  const [agentResults, setAgentResults] = useState<AgentData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // Función auxiliar para procesar las características y casos de uso
  const processStringList = (str: string): string[] => {
    if (!str) return []
    // Eliminar cualquier prefijo común como "Key Features: " o "Use Cases: "
    const cleanStr = str.replace(/^(Key Features:|Use Cases:)\s*/i, '')
    // Dividir por comas o saltos de línea
    return cleanStr.split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item && !item.startsWith('-')) // Filtrar items vacíos y bullets
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const sanitizedQuery = sanitizeInput(values.useCase)
      
      if (!sanitizedQuery.trim()) {
        throw new Error("El texto ingresado no es válido")
      }

      const response = await fetch(`${API_BASE_URL}/query/hybrid-search`, { 
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

      const data: APIResponse = await response.json()
      
      if (!Array.isArray(data.results)) {
        throw new Error('Formato de respuesta inválido')
      }

      // Transformar los resultados al formato esperado
      const transformedResults = data.results
        .slice(0, 3)
        .map(([result]) => {
          const { metadata } = result
          
          return {
            id: metadata.id,
            name: sanitizeInput(metadata.name || ''),
            description: sanitizeInput(metadata.shortDescription || ''),
            category: sanitizeInput(metadata.category || ''),
            industry: sanitizeInput(metadata.industry || ''),
            keyFeatures: processStringList(metadata.keyFeatures || ''),
            useCases: processStringList(metadata.useCases || ''),
            tags: processTags(metadata.tags)
          }
        })

      setAgentResults(transformedResults)
    } catch (error) {
      console.error('Error:', error)
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
