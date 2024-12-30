"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import {
  Environment,
  OrbitControls,
  Preload,
  Html,
  Float,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

function Globe() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#1a237e"
            emissive="#0d47a1"
            emissiveIntensity={0.5}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        
        {/* Network nodes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2.5,
              Math.sin((i / 8) * Math.PI * 2) * 2.5,
              0,
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color="#4fc3f7"
              emissive="#4fc3f7"
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        {/* Connection lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const nextIndex = (i + 1) % 8
          const start = [
            Math.cos((i / 8) * Math.PI * 2) * 2.5,
            Math.sin((i / 8) * Math.PI * 2) * 2.5,
            0,
          ]
          const end = [
            Math.cos((nextIndex / 8) * Math.PI * 2) * 2.5,
            Math.sin((nextIndex / 8) * Math.PI * 2) * 2.5,
            0,
          ]
          return (
            <line key={`line-${i}`}>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...start, ...end])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#4fc3f7" linewidth={1} />
            </line>
          )
        })}
      </Float>
    </group>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset="night" />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

export function LandingHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      <Scene />
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              La Nueva Era de Agentes IA
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Conectando el mundo a través de agentes inteligentes. Automatiza,
              innova y escala tu negocio con nuestra red global de IA.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-6">
                Comienza Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6">
                Explora los Agentes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

