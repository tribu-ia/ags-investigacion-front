'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Clock, ChevronRight, CheckCircle2, Target, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Resource } from '@/types/resource';


interface LearningPathStep {
  title: string;
  resources: Resource[];
  estimatedTime: string;
  completed?: boolean;
}

interface LearningPath {
  title: string;
  description: string;
  steps: LearningPathStep[];
}

interface LearningPathViewProps {
  path: LearningPath;
  timeframe?: string;
  onStepComplete?: (stepIndex: number) => void;
  onResourceStart?: (resource: Resource) => void;
}

export function LearningPathView({ 
  path, 
  timeframe,
  onStepComplete,
  onResourceStart
}: LearningPathViewProps) {
  return (
    <div className="space-y-6">
      {/* Path Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{path.title}</h2>
        </div>
        <p className="text-muted-foreground">{path.description}</p>
        {timeframe && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Clock className="h-4 w-4" />
            <span>Estimated completion: {timeframe}</span>
          </div>
        )}
      </div>

      {/* Learning Steps */}
      <div className="space-y-4">
        {path.steps.map((step, stepIndex) => (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stepIndex * 0.1 }}
          >
            <Card className={step.completed ? "border-green-500/20" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Target className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {step.estimatedTime}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resources for this step */}
                  {step.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{resource.type}</Badge>
                        <span className="font-medium">{resource.title}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onResourceStart?.(resource)}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  ))}

                  {/* Step completion button */}
                  {!step.completed && (
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => onStepComplete?.(stepIndex)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Step as Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>
            {path.steps.filter(s => s.completed).length}/{path.steps.length} steps completed
          </span>
        </div>
       {/*  <Progress 
          value={(path.steps.filter(s => s.completed).length / path.steps.length) * 100} 
          className="h-2"
        /> */}
      </div>

      {/* Next Steps */}
      {path.steps.some(s => !s.completed) && (
        <div className="rounded-lg bg-primary/5 p-4 mt-4">
          <div className="flex items-center gap-2 text-primary">
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium">Next Step:</span>
            <span>
              {path.steps.find(s => !s.completed)?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}