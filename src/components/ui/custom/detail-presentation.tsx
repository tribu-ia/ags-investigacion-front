import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, Users, Trophy, Lightbulb, Target } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"


export function DetailPresentation() {



  return (
  
    <div className="space-y-6">
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Guía Presentacion y Estructura Premiación</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="structure" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold">Estructura de la Presentación</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 space-y-8">
                {/* Previous presentation structure content */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Estructura General (10 minutos)</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">1 min</Badge>
                        <h4 className="font-medium">Introducción</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Presentar el agente de IA</li>
                        <li>• Explicar brevemente su propósito</li>
                        <li>• Problema que resuelve</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">5 min</Badge>
                        <h4 className="font-medium">Detalles Técnicos</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Descripción de la arquitectura</li>
                        <li>• Componentes principales</li>
                        <li>• Algoritmos o modelos utilizados</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">2 min</Badge>
                        <h4 className="font-medium">Impacto y Escenarios</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Aplicaciones prácticas</li>
                        <li>• Ejemplos de uso</li>
                        <li>• Casos hipotéticos</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">1 min</Badge>
                        <h4 className="font-medium">Diferenciación</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Características únicas</li>
                        <li>• Limitaciones encontradas</li>
                        <li>• Desafíos principales</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">1 min</Badge>
                        <h4 className="font-medium">Conclusión</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Resumen de puntos clave</li>
                        <li>• Sesión de preguntas</li>
                        <li>• Próximos pasos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="approaches" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span className="font-semibold">Enfoques Sugeridos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                {/* Previous approaches content */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-6 rounded-lg border bg-card">
                    <h4 className="text-base font-medium mb-4">Enfoque 1: Arquitectura Técnica</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Este enfoque se centra en la estructura técnica y la implementación del agente.</p>
                      
                      <div>
                        <h5 className="font-medium mb-2">Introducción:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Nombre y propósito del agente</li>
                          <li>• ¿Qué problema aborda y por qué es importante?</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Detalles Técnicos:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Explicar el patrón de arquitectura utilizado (e.g., cliente-servidor, orquestación distribuida)</li>
                          <li>• Describir cómo se organizan los componentes del agente (e.g., entrada, procesamiento, salida)</li>
                          <li>• Algoritmos o modelos utilizados (e.g., redes neuronales, árboles de decisión)</li>
                          <li>• Uso de frameworks o bibliotecas específicas (e.g., LangChain, OpenAI API)</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Impacto y Escenarios de Uso:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Ejemplo de un caso técnico, como un flujo de datos de entrada a salida</li>
                          <li>• Escalabilidad del agente y rendimiento en diferentes contextos</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Diferenciación y Limitaciones:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• ¿Por qué se eligió esta arquitectura en lugar de otras opciones?</li>
                          <li>• Desafíos técnicos encontrados durante la implementación</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Conclusión y Preguntas:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Reafirmar la importancia de la arquitectura técnica</li>
                          <li>• Abrir la discusión para profundizar en detalles</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border bg-card">
                    <h4 className="text-base font-medium mb-4">Enfoque 2: Caso de Uso</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Este enfoque prioriza los resultados y aplicaciones prácticas del agente.</p>

                      <div>
                        <h5 className="font-medium mb-2">Introducción:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Presentar el agente y su propósito</li>
                          <li>• Contextualizar el caso de uso principal</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Descripción del caso de uso:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Describir un caso de uso específico</li>
                          <li>• Problema que enfrenta el usuario</li>
                          <li>• Cómo el agente/producto resuelve el problema</li>
                          <li>• Beneficios medibles (e.g., tiempo ahorrado, precisión mejorada)</li>
                          <li>• Otros escenarios donde el agente podría ser útil</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Detalle técnico:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Explicar brevemente cómo el agente está diseñado para cumplir el caso de uso</li>
                          <li>• Algoritmos o modelos clave utilizados</li>
                          <li>• Recursos requeridos para implementar el agente</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Diferenciación y Limitaciones:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Comparación con agentes similares para el mismo caso de uso</li>
                          <li>• Limitaciones prácticas (e.g., requerimientos computacionales, entrenamiento)</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Conclusión y Preguntas:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Resaltar el impacto práctico del agente</li>
                          <li>• Abrir para sugerencias o dudas sobre aplicaciones</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Disponibilidad y/o licenciamiento:</h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>• Tipo de licencia (cerrada, abierta, restringida, requiere pago, etc)</li>
                          <li>• Modelo de negocio o monetización del producto</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prizes" className="border rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-semibold">Premiación Mensual</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 space-y-6">
                {/* Fechas del Ciclo */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Fechas del Primer Ciclo (Enero-Marzo 2025)</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <p>Inicio: Lunes 21 de enero, 2025</p>
                    </div>
                    <p className="ml-6">Duración: 7 semanas (Cada ciclo se reinicia mensualmente)</p>
                  </div>
                </div>

                {/* Condiciones */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Condiciones Generales</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Características de implementación:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                        <li>La implementación debe quedar cargada en el Agente que investigaste como Open Source si es código en el repositorio de Tribu IA</li>
                        <li>Puedes empezar un proyecto desde cero o hacer una extensión a un producto propio tuyo pero el apartado de Agente debe quedar cargado en el repositorio de Tribu IA</li>
                        <li>Debe tener una aplicación en el mundo real (que tan útil es)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Participación en Equipo:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                        <li>Se fomenta el trabajo en equipo dentro de la comunidad</li>
                        <li>Si un participante logra involucrar activamente a la comunidad en la construcción o discusión técnica, se otorgarán 5 puntos adicionales</li>
                        <li>La participación en retos o discusiones técnicas de otros programas de Tribu IA es altamente recomendada. Ejemplo proyectos que tengan en Retos IA</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Subida de Videos:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                        <li>Los videos deben ser menor o máximo de un minuto donde cuentes cuál fue tu solución (Este será el video que verán las personas para realizar la votación)</li>
                        <li>Fecha límite: Martes 18 de febrero, 2025, antes de la charla semanal</li>
                        <li>Se abre plataforma de carga de video el Martes 11 de febrero después de la charla</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Calendario */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Calendario de Actividades</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-2">Semanas 1-4: Inicio y Progreso</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Lunes: Se presentan los participantes y deciden si desean inscribirse</li>
                        <li>• Se divulgan los agentes asignados para trabajar en las semanas</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-2">Semana 5: Evaluación</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Martes 18 de febrero: Fecha límite para cargar los videos de las implementaciones (W1-W4)</li>
                        <li>• Apertura de votaciones al finalizar la charla técnica</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-2">Semana 6: Cierre de Votaciones</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Martes 25 de febrero: Se cierran las votaciones antes de la charla semanal</li>
                        <li>• Durante la charla, se anuncia el ganador</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-2">Semana 7: Premiación y Charla Técnica</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Martes 4 de marzo: Sesión especial donde el ganador realizará un taller práctico</li>
                        <li>• El ganador enseñará a las personas a implementar su Agente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Criterios de Evaluación */}
                <div className="rounded-lg border p-6 bg-primary/5">
                  <h3 className="text-lg font-medium mb-4">Criterios de Evaluación</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <div>
                        <span className="font-medium">Creatividad e Innovación:</span>
                        <span className="text-muted-foreground"> ¿Qué tan original es la solución?</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <div>
                        <span className="font-medium">Colaboración:</span>
                        <span className="text-muted-foreground"> ¿Involucró a otros miembros de la comunidad?</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <div>
                        <span className="font-medium">Impacto:</span>
                        <span className="text-muted-foreground"> ¿Qué tan útil o significativo es el agente desarrollado?</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Premio */}
                <div className="rounded-lg border bg-primary/5 p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Premio al Primer Lugar
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span className="font-medium">$300 USD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Participación en evento en vivo simultáneo en las ciudades donde se consigan locaciones
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Reconocimiento en la comunidad
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
  )
} 