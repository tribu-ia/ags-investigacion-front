"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/ui/custom/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResearcherForm } from "@/components/ui/custom/form/researcher-form"
import { LearnerForm } from "@/components/ui/custom/form/learner-form"
import { Card } from "@/components/ui/card"

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
              Selecciona el tipo de investigación que deseas realizar
            </p>
          </div>

          <div className="grid gap-6">
            <Tabs defaultValue="researcher" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="researcher">Investigador</TabsTrigger>
                <TabsTrigger value="learner">Aprendiz</TabsTrigger>
              </TabsList>
              <TabsContent value="researcher">
                <ResearcherForm />
              </TabsContent>
              <TabsContent value="learner">
                <Card className="mt-4">
                  <LearnerForm />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 