import { useState, useEffect, useMemo } from 'react';

// Column indices that match the Excel structure
const COLUMN = {
  TITLE: 0,
  DESCRIPTION: 1,
  URL: 2,
  TYPE: 3,
  TOPIC: 4,
  TAGS: 5
};

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "guía" | "documentación" | "video" | "presentation";
  topic: string;
  tags: string[];
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/sheets");
        const data = await response.json();
        
        // Skip the header row (first row) and transform the data
        const formattedResources: Resource[] = data.slice(1).map((row: string[], index: number) => ({
          id: `resource-${index}`,
          title: row[COLUMN.TITLE] || '',
          description: row[COLUMN.DESCRIPTION] || '',
          url: row[COLUMN.URL] || '',
          type: (row[COLUMN.TYPE] || 'documentación') as Resource['type'],
          topic: row[COLUMN.TOPIC] || 'General',
          tags: row[COLUMN.TAGS] ? 
            (typeof row[COLUMN.TAGS] === 'string' ? 
              row[COLUMN.TAGS].split(',').map(tag => tag.trim()) : 
              [row[COLUMN.TAGS]].filter(Boolean)
            ) : []
        }));

        setResources(formattedResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Rest of the hook implementation remains the same...
  const { topics, allTags, typeCategories } = useMemo(() => {
    const topicsSet = new Set<string>();
    const tagsSet = new Set<string>();
    const typesSet = new Set<string>();

    resources.forEach((resource) => {
      if (resource.topic) topicsSet.add(resource.topic);
      if (Array.isArray(resource.tags)) {
        resource.tags.forEach(tag => tag && tagsSet.add(tag));
      }
      if (resource.type) typesSet.add(resource.type);
    });

    return {
      topics: Array.from(topicsSet),
      allTags: Array.from(tagsSet),
      typeCategories: Array.from(typesSet)
    };
  }, [resources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = !searchTerm || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(resource.tags) && resource.tags.some(tag => 
          tag && tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      const matchesTopic = !selectedTopic || resource.topic === selectedTopic;
      const matchesType = !selectedType || resource.type === selectedType;

      return matchesSearch && matchesTopic && matchesType;
    });
  }, [resources, searchTerm, selectedTopic, selectedType]);

  // Group resources by topic
  const resourcesByTopic = useMemo(() => {
    const grouped = new Map<string, Resource[]>();
    
    filteredResources.forEach(resource => {
      if (resource.topic) {
        const existing = grouped.get(resource.topic) || [];
        grouped.set(resource.topic, [...existing, resource]);
      }
    });

    return grouped;
  }, [filteredResources]);

  return {
    resources: filteredResources,
    topics,
    allTags,
    typeCategories,
    resourcesByTopic,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedTopic,
    setSelectedTopic,
    selectedType,
    setSelectedType
  };
}