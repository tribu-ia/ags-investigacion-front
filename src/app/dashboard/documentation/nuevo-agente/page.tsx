"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/ui/custom/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NuevoAgentePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/documentation">
                    Documentation
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Investigar Nuevo Agente</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Investigar Nuevo Agente</h1>
            <p className="text-muted-foreground">
              Completa el formulario para iniciar una nueva investigación de agente.
            </p>
          </div>
          
          <div className="grid gap-6 max-w-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Agente</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Asistente de Análisis de Datos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo Principal</Label>
                <Textarea
                  id="objetivo"
                  placeholder="Describe el objetivo principal del agente..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacidades">Capacidades Requeridas</Label>
                <Textarea
                  id="capacidades"
                  placeholder="Lista las capacidades que debería tener el agente..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recursos">Recursos Necesarios</Label>
                <Textarea
                  id="recursos"
                  placeholder="Describe los recursos necesarios para el desarrollo..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="pt-4">
                <Button className="w-full">
                  Iniciar Investigación
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 