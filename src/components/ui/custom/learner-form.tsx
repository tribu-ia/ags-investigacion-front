"use client"

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

const formSchema = z.object({
  useCase: z.string().min(10, "Por favor, describe tu caso de uso en al menos 10 caracteres."),
})

export function LearnerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí enviarías los datos a tu backend
    console.log(values)
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

            <Button type="submit" className="w-full">
              Consultar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

