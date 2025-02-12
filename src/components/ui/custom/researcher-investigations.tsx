import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, Users } from "lucide-react"

type PrimaryResearch = {
  assignmentId: string
  presentationDate: string
  presentationTime: string
  status: string
  presentationWeek: string
  agentName: string
  agentDescription: string
  agentCategory: string
  agentIndustry: string
}

type ContributorResearch = {
  id: string
  name: string
  category: string
  industry: string
  shortDescription: string
  longDescription: string | null
  role: string
  assignmentId: string
}

type ResearcherDetails = {
  id: string
  name: string
  email: string
  avatarUrl: string
  repositoryUrl: string
  linkedinProfile: string
  role: string | null
  githubUsername: string
  primaryResearches: PrimaryResearch[]
  contributorsResearches: ContributorResearch[]
  showOrder: number
}

export function ResearcherInvestigations({ details }: { details: ResearcherDetails }) {
  const [selectedResearch, setSelectedResearch] = useState<string | null>(
    details.primaryResearches[0]?.assignmentId || 
    details.contributorsResearches[0]?.assignmentId || 
    null
  )

  const allResearches = [
    ...details.primaryResearches.map(r => ({
      ...r,
      type: 'primary' as const
    })),
    ...details.contributorsResearches.map(r => ({
      assignmentId: r.assignmentId,
      agentName: r.name,
      agentDescription: r.shortDescription,
      agentCategory: r.category,
      agentIndustry: r.industry,
      type: 'contributor' as const
    }))
  ]

  const selectedResearchDetails = allResearches.find(r => r.assignmentId === selectedResearch)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedResearch || ''}
          onValueChange={setSelectedResearch}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecciona una investigación" />
          </SelectTrigger>
          <SelectContent>
            {details.primaryResearches.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">Investigaciones Primarias</div>
                {details.primaryResearches.map((research) => (
                  <SelectItem key={research.assignmentId} value={research.assignmentId}>
                    {research.agentName}
                  </SelectItem>
                ))}
              </>
            )}
            {details.contributorsResearches.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">Investigaciones Contribuidor</div>
                {details.contributorsResearches.map((research) => (
                  <SelectItem key={research.assignmentId} value={research.assignmentId}>
                    {research.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedResearchDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedResearchDetails.agentName}</CardTitle>
              <Badge variant={selectedResearchDetails.type === 'primary' ? 'default' : 'secondary'}>
                {selectedResearchDetails.type === 'primary' ? 'Primario' : 'Contribuidor'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{selectedResearchDetails.agentDescription}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{selectedResearchDetails.agentCategory}</Badge>
                <Badge variant="outline">{selectedResearchDetails.agentIndustry}</Badge>
              </div>
            </div>

            {selectedResearchDetails.type === 'primary' && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Detalles de Presentación</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{(selectedResearchDetails as PrimaryResearch).presentationDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{(selectedResearchDetails as PrimaryResearch).presentationTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Semana {(selectedResearchDetails as PrimaryResearch).presentationWeek}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 