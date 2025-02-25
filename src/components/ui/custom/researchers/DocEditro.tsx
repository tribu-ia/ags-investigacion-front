import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";

export const DocumentationTemplate = ({ 
  investigationProgress, 
  streamedText 
}: { 
  investigationProgress?: string, 
  streamedText?: string 
}) => {
  const [isInvestigationStarted, setIsInvestigationStarted] = useState(false);
  const [documentationText, setDocumentationText] = useState('');
  
  // Default template description
  const defaultTemplateDescription = `# Título del Documento

  ## Descripción
  Aquí va la descripción detallada de tu investigación.
  
  ## Características Principales
  - Característica 1
  - Característica 2
  - Característica 3
  
  ## Ejemplo de Código
 
  
  ## Tabla de Contenidos
  | Sección | Descripción |
  |---------|-------------|
  | Intro   | Introducción|
  | Demo    | Demostración|
  
  > **Nota:** Este es un ejemplo de cómo se verá el formato en GitHub.`;
  
  const copilotDescription = `# GitHub Copilot: AI Pair Programmer
## Introducción
GitHub Copilot es una herramienta de inteligencia artificial diseñada para asistir a desarrolladores en la escritura de código.
## Características Principales
- Generación de código en tiempo real
- Soporte para múltiples lenguajes de programación
- Aprendizaje continuo basado en patrones de código
## Funcionamiento
Copilot utiliza modelos de lenguaje avanzados para:
- Sugerir completaciones de código
- Generar funciones completas
- Interpretar comentarios y convertirlos en código
## Beneficios
1. Aumento de productividad
2. Reducción de código repetitivo
3. Aprendizaje de mejores prácticas de programación
## Ejemplo de Uso
\`\`\`python
# Copilot puede generar código basado en comentarios
def calcular_promedio(numeros):
    # Calcula el promedio de una lista de números
    # Copilot puede completar esta función automáticamente
\`\`\``;

  useEffect(() => {
    console.log(investigationProgress)
    if (investigationProgress === 'Iniciando el proceso de investigación...') {
      let currentIndex = 0;
      const streamInterval = setInterval(() => {
        if (currentIndex < copilotDescription.length) {
          setDocumentationText(prev => prev + copilotDescription[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(streamInterval);
        }
      }, 20); // Adjust speed of text streaming
      return () => clearInterval(streamInterval);
    }
  }, [isInvestigationStarted, investigationProgress]);

  const handleStartInvestigation = () => {
    setIsInvestigationStarted(true);
    // Dispatch event or other logic as needed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full font-mono text-sm h-full relative"
    >
      <Card className="border-2 border-primary/10 h-full">
        <CardContent className="p-4">
          <div className="bg-muted p-2 mb-4 rounded-sm">
            {investigationProgress || "Documentación de Investigación"}
          </div>
          <pre className="whitespace-pre-wrap text-sm min-h-[300px] overflow-auto">
            {documentationText || defaultTemplateDescription}
          </pre>
        {/* Floating Buttons */}
   {/* Retro Floating Buttons */}
   <div className="absolute bottom-4 right-4 flex space-x-2">
            <motion.button
              onClick={handleStartInvestigation}
              disabled={isInvestigationStarted}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative overflow-hidden
                px-4 py-2 
                text-sm font-medium
                ${isInvestigationStarted 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-[#5cbef8] hover:text-white'}
                border-2 
                rounded-lg
                transition-all duration-300
                before:absolute before:inset-0 
                before:bg-gradient-to-r 
                before:from-[#5cbef8] 
                before:to-[#3aa0f2] 
                before:opacity-0 hover:before:opacity-20
                before:-z-10
                shadow-sm hover:shadow-md
              `}
            >
              {isInvestigationStarted ? 'Investigación en curso' : 'iniciar investigacion'}
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className="
                relative overflow-hidden
                px-4 py-2 
                text-sm font-medium
                text-emerald-500 hover:text-white
                border-2 border-emerald-500
                rounded-lg
                transition-all duration-300
                before:absolute before:inset-0 
                before:bg-gradient-to-r 
                before:from-emerald-500 
                before:to-emerald-400 
                before:opacity-0 hover:before:opacity-20
                before:-z-10
                shadow-sm hover:shadow-md
              "
            >
              finalizar documentacion
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};