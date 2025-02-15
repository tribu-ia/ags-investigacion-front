"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

/*
    TODO: I added the email and discord user, but these may not be needed.

    Define:
    - Which fields will be needed
    - How the question will be answered to the user (email, discord...?)
    - Where it will be saved
*/
const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
  discordUsername: z.string().min(2, {
    message: "Por favor, ingresa tu nombre de usuario de Discord.",
  }),
  question: z
    .string()
    .min(2, {
      message: "Por favor, describe lo que estás necesitando.",
    })
    .max(100, {
      message: "La descripción debe tener menos de 100 caracteres.",
    }),
});

export const ReadyToJoin = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      discordUsername: "",
      question: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // add logic to store information for user feedback
    console.log(values);

    const promiseSample = new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        resolve({ success: true });
      }, 2000);
    });

    toast.promise(promiseSample, {
      loading: "Enviando tu consulta...",
      success: "¡Tu consulta ha sido enviada con éxito!",
      error: "¡Hubo un error al enviar tu consulta!",
      description: (
        <p className="text-muted-foreground">
          Recibirás una respuesta en tu correo electrónico, lo antes posible.
        </p>
      ),
      finally: () => setLoading(false),
    });
  }

  return (
    <div className="group relative grid overflow-hidden rounded-lg bg-secondary-foreground/5 shadow-sm border border-border ring-0 hover:border-primary hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary/50 transition-all duration-200">
      <div className="absolute inset-0 size-full bg-[radial-gradient(#00000055_1px,transparent_1px)] [background-size:16px_16px] blur-[1.5px]" />
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-50%" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-50%" />
        <div className="relative p-10 backdrop-blur-[0.5px] space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl/8 font-medium tracking-tight text-gray-950 dark:text-white">
              Encuentra tu Agente Perfecto
            </h2>

            <p className="text-sm/7">
              Cuéntanos tu caso de uso y te ayudaremos a encontrar el agente
              ideal para ti.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Correo Electrónico"
                        autoComplete="off"
                        disabled={form.formState.isSubmitting || loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discordUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="discordUsername">
                      Usuario de Discord
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ejemplo: Usuario#1234 o Usuario"
                        autoComplete="off"
                        disabled={form.formState.isSubmitting || loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="question">
                      ¿Qué necesitas de tu agente?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full max-h-36 min-h-28"
                        placeholder="Describe lo que estás necesitando. Por ejemplo: Quiero un agente que me ayude a analizar datos de ventas y generar informes semanales..."
                        autoComplete="off"
                        disabled={form.formState.isSubmitting || loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  loading
                }
              >
                {loading ? "Enviando..." : "Consultar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
