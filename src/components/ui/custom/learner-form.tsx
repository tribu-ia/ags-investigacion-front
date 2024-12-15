"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { AgentResult } from "./agent-result"

const formSchema = z.object({
  useCase: z.string().min(10, "Por favor, describe tu caso de uso en al menos 10 caracteres."),
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
      const response = await fetch('http://localhost:8001/query/hybrid-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: values.useCase }),
      })
      const data = await response.json()
      
      // Process and transform the data
      const transformedResults = data.results.slice(0, 3).map((result: any) => {
        const metadata = result[0].metadata
        const content = result[0].page_content
        
        // Extract key features, use cases, and tags from the content
        const keyFeatures = content.match(/Key Features: (.+)/)?.[1].split(', ') || []
        const useCases = content.match(/Use Cases: (.+)/)?.[1].split(', ') || []
        const tags = content.match(/Tags: (.+)/)?.[1].split(', ') || []

        return {
          id: metadata.id,
          name: metadata.name,
          description: content.match(/Description: (.+)/)?.[1] || '',
          category: metadata.category,
          industry: metadata.industry,
          keyFeatures,
          useCases,
          tags,
        }
      })

      setAgentResults(transformedResults)
    } catch (error) {
      console.error('Error fetching agent results:', error)
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

