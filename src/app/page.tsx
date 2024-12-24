import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResearcherForm } from "@/components/ui/custom/researcher-form"
import { LearnerForm } from "@/components/ui/custom/learner-form"
import "./fonts/background.css";

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-8 min-h-screen to-muted margin-top">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Plataforma de Agentes IA
        </h1>
        <p className="text-lg md:text-xl max-w-[700px] mx-auto margin-bottom">
          Únete a nuestra comunidad de investigadores o encuentra el agente perfecto para tu caso de uso
        </p>
      </div>
      
      <Tabs defaultValue="researcher" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="researcher">Para Investigadores</TabsTrigger>
          <TabsTrigger value="learner">Encuentra tu Agente</TabsTrigger>
        </TabsList>
        <TabsContent value="researcher">
          <ResearcherForm />
        </TabsContent>
        <TabsContent value="learner">
          <LearnerForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}

