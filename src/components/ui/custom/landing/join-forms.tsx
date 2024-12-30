"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ResearcherForm } from "@/components/ui/custom/form/researcher-form"
import { LearnerForm } from "@/components/ui/custom/form/learner-form"

export function JoinForms() {
  return (
    <section id="join-forms" className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 max-w-[42rem] mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Únete a la Comunidad
            </h2>
            <p className="text-gray-400 md:text-lg">
              Ya sea como investigador o buscando el agente perfecto para tu proyecto,
              estamos aquí para ayudarte.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="researcher" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="researcher">Para Investigadores</TabsTrigger>
              <TabsTrigger value="learner">Encuentra tu Agente</TabsTrigger>
            </TabsList>
            <div className="min-h-[600px]">
              <TabsContent value="researcher" className="p-6 border rounded-lg mt-4 bg-gray-900/50">
                <ResearcherForm />
              </TabsContent>
              <TabsContent value="learner" className="p-6 border rounded-lg mt-4 bg-gray-900/50">
                <LearnerForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
} 