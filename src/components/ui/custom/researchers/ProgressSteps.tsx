import { motion } from "framer-motion";
import { CheckCircle, CircleDot, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressStepsProps {
  currentStep: 'creating' | 'documenting';
  isCompleted?: boolean;
}

export const ProgressSteps = ({ currentStep, isCompleted = false }: ProgressStepsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="w-full"
    >
      <Card className="h-full border-2 border-primary/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-[#5cbef8]">Progreso</h3>
          <div className="space-y-8">
            {/* Creating Agents Step */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : currentStep === 'creating' ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <CircleDot className="w-6 h-6 text-[#5cbef8]" />
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-[#5cbef8]/20"
                      />
                    </motion.div>
                  ) : (
                    <CircleDot className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <span className={currentStep === 'creating' ? 'text-[#5cbef8] font-medium' : 'text-muted-foreground'}>
                  Creando Agentes
                </span>
              </div>
              <div className="absolute left-3 top-8 h-12 w-px bg-border" />
            </div>

            {/* Documenting Step with Content */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  {currentStep === 'documenting' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <FileText className="w-6 h-6 text-[#5cbef8]" />
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-[#5cbef8]/20"
                      />
                    </motion.div>
                  )}
                  {currentStep !== 'documenting' && (
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <span className={currentStep === 'documenting' ? 'text-[#5cbef8] font-medium' : 'text-muted-foreground'}>
                  Documentando
                </span>
              </div>

              {/* Documentation Content - Only show when in documenting step */}
              {currentStep === 'documenting' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="ml-8 space-y-4"
                >
                  <Card className="border border-border/50">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Presentación</Badge>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                          En progreso
                        </span>
                      </div>
                      <CardTitle className="text-base">Detalles de la Presentación</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">
                        <p>Complete su documentación para la presentación del agente.</p>
                        <ul className="mt-2 space-y-1">
                          <li>• Descripción del agente</li>
                          <li>• Características principales</li>
                          <li>• Ejemplos de uso</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};