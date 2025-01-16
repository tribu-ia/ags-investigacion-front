'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ParticleExplosion from './particle-explosion'

interface LikeButtonProps {
  initialLiked?: boolean
  initialCount?: number
}

export const LikeButton: React.FC<LikeButtonProps> = ({ initialLiked = false, initialCount = 0 }) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isExploding, setIsExploding] = useState(false)

  const handleClick = () => {
    setIsLiked(!isLiked)
    setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1)
    if (!isLiked) {
      setIsExploding(true)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-0.5 rounded-full transition-all duration-300 ease-in-out`}
      onClick={handleClick}
    >
      <div className="relative flex justify-center items-center w-6 h-6">
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.2, 1] : 1,
            rotate: isLiked ? [0, 20, 0] : 0
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 500, damping: 15 }}
        >
          <ThumbsUp className={`w-6 h-6 stroke-2 transition-all duration-300 ease-in-out ${
            isLiked ? 'fill-fuchsia-600 stroke-fuchsia-600' : 'fill-transparent stroke-fuchsia-600'
          }`} />
        </motion.div>
        <AnimatePresence>
          {isExploding && (
            <ParticleExplosion onComplete={() => setIsExploding(false)} />
          )}
        </AnimatePresence>
      </div>

      <motion.span
        key={likeCount}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        {likeCount}
      </motion.span>
    </Button>
  )
}

export default LikeButton
