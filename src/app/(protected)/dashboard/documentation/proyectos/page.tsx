import { ProjectList } from '@/components/ui/custom/projects/projects-list'

export default function ProjectsPage() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Proyectos de Agentes</h1>
        <p className="text-muted-foreground">
          Conoce todos los proyectos de agentes que se están implementando en la Tribu IA
        </p>
      </div>
      <div className="flex-1">
        <ProjectList />
      </div>
    </section>
  )
}