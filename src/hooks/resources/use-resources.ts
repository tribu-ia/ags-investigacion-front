// hooks/use-resources.ts
import { useState, useEffect } from "react";
import { Resource } from "@/types/resource";
import { createFilter } from "@/lib/utils";

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTopic, selectedType]);

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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTopic("Todos");
    setSelectedType("Todos");
  };

  return {
    resources: filteredResources,
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
  };
}