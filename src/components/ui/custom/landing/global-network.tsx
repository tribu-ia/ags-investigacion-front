"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { motion as m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Vector3 } from "three"

function NetworkNodes() {
  const points = Array.from({ length: 12 }, (_, i) => ({
    position: new Vector3(
      Math.cos((i / 12) * Math.PI * 2) * 3,
      Math.sin((i / 12) * Math.PI * 2) * 3,
      0
    ),
    color: i % 2 === 0 ? "#4fc3f7" : "#f06292",
  }))

  return (
    <group>
      {points.map((point, i) => (
        <mesh
          key={i}
          position={point.position}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={point.color}
            emissive={point.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

export function GlobalNetwork() {
  return (
    <m.section 
      className="relative h-[800px] w-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <NetworkNodes />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <h1 className="text-4xl font-bold text-white mb-8">Global Network</h1>
        <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
          Únete a la Red
        </Button>
      </div>
    </m.section>
  )
}

