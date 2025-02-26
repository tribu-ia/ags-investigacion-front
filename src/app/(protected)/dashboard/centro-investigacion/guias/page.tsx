"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput } from "@/components/ui/command";
import { createFilter } from "@/lib/utils";
import { EmptyStateContent } from "@/components/ui/empty-state";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCards} from "@/components/ui/skeleton-card";
import { Resource } from "@/types/resource";
import { cardVariants } from "@/components/resources/variants";
import { RESOURCES_TOPICS, RESOURCES_TYPES } from "@/lib/constants";
const ResourceCard = motion(Card);
export default function GuiasRecursosPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/sheets");
        const result = await response.json();

        const transformedData = result
          .slice(1)
          .map((row: string[], index: number) => ({
            id: index.toString(),
            title: row[0] || "",
            description: row[1] || "",
            url: row[2] || "#",
            type: row[3]?.toLowerCase() || "guide",
            topic: row[4] || "Otros",
          }));

        setResources(transformedData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const resourceFilter = createFilter<Resource>({
    searchFields: ["title", "description"],
    filters: [
      { field: "topic", value: selectedTopic, defaultValue: "Todos" },
      { field: "type", value: selectedType, defaultValue: "Todos" },
    ],
  });

  const filteredResources = resourceFilter(resources, searchTerm, {
    topic: selectedTopic,
    type: selectedType,
  });

  return (
        <motion.div
          className="flex flex-1 flex-col gap-4 p-4 pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Guías y Recursos
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Explora nuestra colección de recursos para aprender sobre agentes
              IA
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Buscar recursos..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
            </Command>

            <motion.div className="flex flex-wrap gap-2" layout>
              <div className="space-y-2">
                <p className="text-sm font-medium">Temas:</p>
                <div className="flex flex-wrap gap-2">
                  {RESOURCES_TOPICS.map((topic) => (
                    <motion.div
                      key={topic}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={
                          selectedTopic === topic ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Tipo:</p>
                <div className="flex flex-wrap gap-2">
                  {RESOURCES_TYPES.map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={selectedType === type ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3"
              layout="position"
              layoutRoot
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <SkeletonCards count={3} />
                ) : filteredResources.length === 0 ? (
                  <EmptyStateContent
                    icon={<FileSearch className="h-12 w-12 text-primary/60" />}
                    title="No hay recursos disponibles"
                    description={`No se encontraron recursos ${
                      searchTerm ? "para tu búsqueda" : "en esta categoría"
                    }`}
                    action={
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTopic("Todos");
                          setSelectedType("Todos");
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    }
                  />
                ) : (
                  filteredResources.map((resource) => (
                    <motion.div key={resource.id} className="h-full">
                      <ResourceCard
                        className="h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:backdrop-blur-md"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        whileHover="hover"
                        layout="position"
                      >
                        <CardHeader className="flex-none">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <CardTitle className="line-clamp-2 leading-tight">
                                {resource.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-4 mt-2">
                                {resource.description}
                              </CardDescription>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {resource.type}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 justify-between">
                          <motion.a
                            href={resource.url}
                            target="_blank"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-auto"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            Ver recurso
                            <span aria-hidden="true">→</span>
                          </motion.a>
                        </CardContent>
                      </ResourceCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
  );
}
