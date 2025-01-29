"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Resource } from "@/types/resource";

import { SkeletonCards } from "@/components/ui/skeleton-card";
import { EmptyStateContent } from "@/components/ui/empty-state";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceItem } from "./resource-card";

interface ResourceGridProps {
  resources: Resource[];
  isLoading: boolean;
  searchTerm: string;
  onReset: () => void;
  currentPage: number;
  itemsPerPage: number;
}

export function ResourceGrid({
  resources,
  isLoading,
  searchTerm,
  onReset,
  currentPage,
  itemsPerPage,
}: ResourceGridProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = resources.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3"
      layout="position"
      layoutRoot
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SkeletonCards count={itemsPerPage} />
        ) : resources.length === 0 ? (
          <EmptyStateContent
            icon={<FileSearch className="h-12 w-12 text-primary/60" />}
            title="No hay recursos disponibles"
            description={`No se encontraron recursos ${
              searchTerm ? "para tu búsqueda" : "en esta categoría"
            }`}
            action={
              <Button onClick={onReset}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          paginatedResources.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}