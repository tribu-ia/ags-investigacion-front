"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense } from "react"
import {
  Environment,
  OrbitControls,
  Preload,
  Html,
  Float,
  MeshDistortMaterial,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useRef } from "react"
import { Vector3, Group, Mesh, Clock } from "three"

interface FrameState {
  clock: Clock
}

function InnerParticles() {
  const particlesRef = useRef<Group>(null)
  const particles = Array.from({ length: 50 }, () => ({
    position: new Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    ),
    speed: Math.random() * 0.01 + 0.005,
    offset: Math.random() * Math.PI * 2,
  }))

  useFrame(({ clock }: FrameState) => {
    if (!particlesRef.current) return
    particles.forEach((particle, i) => {
      const child = particlesRef.current?.children[i] as Mesh
      if (child) {
        const angle = clock.getElapsedTime() * particle.speed + particle.offset
        child.position.x = Math.cos(angle) * 1.5
        child.position.y = Math.sin(angle) * 1.5
        child.position.z = Math.sin(angle * 2) * 0.5
        child.scale.setScalar(Math.sin(angle * 3) * 0.3 + 0.7)
      }
    })
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#4fc3f7"
            emissive="#4fc3f7"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function Globe() {
  const globeRef = useRef<Mesh>(null)

  useFrame(({ clock }: FrameState) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Esfera principal con distorsión */}
        <mesh ref={globeRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <MeshDistortMaterial
            color="#1a237e"
            emissive="#0d47a1"
            emissiveIntensity={0.5}
            roughness={0.7}
            metalness={0.3}
            distort={0.3}
            speed={2}
          />
        </mesh>

        <InnerParticles />
        
        {/* Anillos externos */}
        <group rotation-x={Math.PI / 2}>
          {[2.1, 2.2, 2.3].map((radius, i) => (
            <mesh key={i}>
              <ringGeometry args={[radius, radius + 0.02, 64]} />
              <meshBasicMaterial
                color="#4fc3f7"
                transparent
                opacity={0.2 - i * 0.05}
              />
            </mesh>
          ))}
        </group>
        
        {/* Nodos de la red */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 12) * Math.PI * 2) * 2.5,
              Math.sin((i / 12) * Math.PI * 2) * 2.5,
              0,
            ]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#4fc3f7"
              emissive="#4fc3f7"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Líneas de conexión */}
        {Array.from({ length: 12 }).map((_, i) => {
          const nextIndex = (i + 1) % 12
          const start = [
            Math.cos((i / 12) * Math.PI * 2) * 2.5,
            Math.sin((i / 12) * Math.PI * 2) * 2.5,
            0,
          ]
          const end = [
            Math.cos((nextIndex / 12) * Math.PI * 2) * 2.5,
            Math.sin((nextIndex / 12) * Math.PI * 2) * 2.5,
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
              <lineBasicMaterial
                attach="material"
                color="#4fc3f7"
                opacity={0.5}
                transparent
                toneMapped={false}
              />
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
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={2} />
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

