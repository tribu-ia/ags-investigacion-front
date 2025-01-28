'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ParticleExplosionProps {
  onComplete: () => void
}

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({ onComplete }) => {
  const particles = Array.from({ length: 8 })

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-fuchsia-600 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onAnimationComplete={index === 0 ? onComplete : undefined}
        />
      ))}
    </div>
  )
}

export default ParticleExplosion
