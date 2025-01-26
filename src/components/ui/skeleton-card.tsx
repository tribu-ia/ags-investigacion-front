import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "./card";
interface SkeletonCardProps {
  count?: number;
  staggerDelay?: number;
 }
 
 export const SkeletonCards = ({ count = 3, staggerDelay = 0.1 }: SkeletonCardProps) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        className="h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * staggerDelay }}
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded opacity-70" />
              </div>
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded opacity-60" />
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded opacity-60" />
              <div className="mt-auto pt-4">
                <div className="h-4 w-24 bg-muted animate-pulse rounded opacity-50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </>
 );