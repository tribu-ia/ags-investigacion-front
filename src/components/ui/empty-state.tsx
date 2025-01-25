"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"


/**
 * A component for displaying empty state content with optional icon, title, description and action.
 * Includes smooth animations on mount/unmount and supports all div props.
 * 
 * @component
 * @example
 * ```tsx
 * <EmptyStateContent
 *   icon={<Icon />}
 *   title="No items found"
 *   description="Try adjusting your search"
 *   action={<Button>Try Again</Button>}
 * />
 * ```
 * 
 * @property {React.ReactNode} [icon] - Optional icon displayed in a rounded background
 * @property {string} [title] - Optional header text
 * @property {string} [description] - Optional description text
 * @property {React.ReactNode} [action] - Optional action element (e.g. button)
 * @property {string} [className] - Additional CSS classes
 * 
 * @extends {React.ComponentPropsWithoutRef<typeof motion.div>}
 */
interface EmptyStateContentProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

/**
 * Renders empty state content with animations and optional elements.
 * 
 * Animation properties:
 * - Fades and slides up on mount
 * - Fades and slides down on unmount
 * - Action has delayed fade-in
 */
const EmptyStateContent = React.forwardRef<
  React.ElementRef<typeof motion.div>,
  React.ComponentPropsWithoutRef<typeof motion.div> & {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: React.ReactNode
  }
>(({ className, icon, title, description, action, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "col-span-full flex flex-col items-center justify-center gap-4 p-8 text-center",
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {icon && (
      <div className="rounded-full bg-muted/50 backdrop-blur-sm p-6 shadow-inner">
        {icon}
      </div>
    )}
    <div className="space-y-2">
      {title && (
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground max-w-[150px] sm:max-w-[300px]">
          {description}
        </p>
      )}
    </div>
    {action && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {action}
      </motion.div>
    )}
  </motion.div>
))
EmptyStateContent.displayName = "EmptyStateContent"

export {  EmptyStateContent }