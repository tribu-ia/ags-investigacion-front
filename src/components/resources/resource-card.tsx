"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Resource } from "@/types/resource";
import { cardVariants } from "./variants";

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = motion(Card);

export function ResourceItem({ resource }: ResourceCardProps) {
  return (
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
          <div className="flex justify-between items-start gap-4 relative">
            <div>
              <CardTitle className="line-clamp-2 leading-tight">
                {resource.title}
              </CardTitle>
              <CardDescription className="line-clamp-4 mt-2">
                {resource.description}
              </CardDescription>
            </div>
            <div className="absolute right-0 top-0 flex flex-col gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {resource.type}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {resource.topic}
              </span>
            </div>
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
  );
}
