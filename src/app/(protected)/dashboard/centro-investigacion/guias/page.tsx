"use client";

import { motion } from "framer-motion";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { useResources } from "@/hooks/resources/use-resources";
import { ResourcePagination } from "@/components/resources/resource-pagination";
import { PageHeader } from "@/components/resources/page-header";



const ITEMS_PER_PAGE = 6;

export default function GuiasRecursosPage() {
  const {
    resources,
    isLoading,
    searchTerm,
    selectedTopic,
    selectedType,
    currentPage,
    setSearchTerm,
    setSelectedTopic,
    setSelectedType,
    setCurrentPage,
    resetFilters,
  } = useResources();

  const totalPages = Math.ceil(resources.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
   
        <PageHeader
          title="Guías y Recursos"
          description="Explora nuestra colección de recursos para aprender sobre agentes IA"
        />
        
        <motion.div   className="flex flex-1 flex-col gap-4 p-4 pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <ResourceFilters
            searchTerm={searchTerm}
            selectedTopic={selectedTopic}
            selectedType={selectedType}
            onSearchChange={setSearchTerm}
            onTopicChange={setSelectedTopic}
            onTypeChange={setSelectedType}
          />

          <ResourceGrid
            resources={resources}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onReset={resetFilters}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {!isLoading && resources.length > ITEMS_PER_PAGE && (
            <ResourcePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.div>
    
    </div>
  );
}