import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export function AgentResult({ agent }: { agent: AgentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Categoría</h4>
            <p className="text-sm">{agent.category}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Industria</h4>
            <p className="text-sm">{agent.industry}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Características Clave</h4>
          <div className="flex flex-wrap gap-2">
            {agent.keyFeatures.map((feature, index) => (
              <Badge key={index} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Casos de Uso</h4>
          <ul className="list-disc list-inside text-sm">
            {agent.useCases.map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Etiquetas</h4>
          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

