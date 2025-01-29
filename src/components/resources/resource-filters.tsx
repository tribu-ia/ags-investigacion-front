"use client";

import { motion } from "framer-motion";
import { Command, CommandInput } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { RESOURCES_TOPICS, RESOURCES_TYPES } from "@/lib/constants";

interface ResourceFiltersProps {
  searchTerm: string;
  selectedTopic: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onTopicChange: (topic: string) => void;
  onTypeChange: (type: string) => void;
}

export function ResourceFilters({
  searchTerm,
  selectedTopic,
  selectedType,
  onSearchChange,
  onTopicChange,
  onTypeChange,
}: ResourceFiltersProps) {
  return (
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
          onValueChange={onSearchChange}
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
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onTopicChange(topic)}
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
                  onClick={() => onTypeChange(type)}
                >
                  {type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
