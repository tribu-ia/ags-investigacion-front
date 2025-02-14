"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkeletonCards } from '../ui/skeleton-card';
import { ResourceItem } from './resource-card';
import { Resource } from '@/types/resource';
import { useResources } from '@/hooks/resources/use-resources';




export function ResourceList() {
  const { 
    resources, 
    searchTerm,
    setSearchTerm,
    isLoading 
  } = useResources();
console.log(resources);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          Recursos de Aprendizaje
        </CardTitle>
        <CardDescription>
          Explora recursos y recibe guía personalizada para tu camino de aprendizaje
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="grid gap-6">
          {/* Search and filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar recursos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                Filtros
              </Button>
            </div>
          </div>

          {/* Resources Grid */}
          <ScrollArea className="h-[calc(100vh-15rem)]">
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCards count={6} key={i} />
                  ))
                ) : (
                  resources.map((resource:Resource) => (
                    <motion.div
                      key={resource.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ResourceItem resource={resource} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}