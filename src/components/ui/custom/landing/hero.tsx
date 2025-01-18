"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef, useMemo, useEffect, useState } from "react"
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
import { Vector3, Group, Mesh, Clock, BufferAttribute } from "three"
import axios from "axios"
import { useRouter } from "next/navigation"

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

interface NodeData {
  baseRadius: number
  speed: number
  offset: number
  radiusVariation: number
  heightVariation: number
  direction: number
  phaseOffset: number
}

function NetworkNodes({ nodes }: { nodes: NodeData[] }) {
  const nodesRef = useRef<Group>(null)

  useFrame(({ clock }: FrameState) => {
    if (!nodesRef.current) return
    const time = clock.getElapsedTime()
    
    nodes.forEach((node, i) => {
      const child = nodesRef.current?.children[i] as Mesh
      if (child) {
        const angle = time * node.speed * node.direction + node.offset
        const radius = node.baseRadius + Math.sin(time * 0.5 + node.phaseOffset) * node.radiusVariation
        const height = Math.sin(time * 0.3 + node.phaseOffset) * node.heightVariation
        const depth = Math.cos(time * 0.4 + node.phaseOffset) * 0.5

        child.position.x = Math.cos(angle) * radius
        child.position.y = Math.sin(angle) * radius + height
        child.position.z = depth
        
        // Hacer que los nodos pulsen sutilmente
        const scale = Math.sin(time * 2 + node.phaseOffset) * 0.2 + 1
        child.scale.setScalar(scale)
      }
    })
  })

  return (
    <group ref={nodesRef}>
      {nodes.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.08, 16, 16]} />
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

function ConnectionLines({ nodes }: { nodes: NodeData[] }) {
  const linesRef = useRef<Group>(null)

  useFrame(({ clock }: FrameState) => {
    if (!linesRef.current) return
    const time = clock.getElapsedTime()

    // Actualizar las líneas para que sigan a los nodos
    nodes.forEach((node, i) => {
      const nextNode = nodes[(i + 1) % nodes.length]
      const line = linesRef.current?.children[i] as Mesh

      if (line) {
        const angle1 = time * node.speed * node.direction + node.offset
        const angle2 = time * nextNode.speed * nextNode.direction + nextNode.offset

        const radius1 = node.baseRadius + Math.sin(time * 0.5 + node.phaseOffset) * node.radiusVariation
        const radius2 = nextNode.baseRadius + Math.sin(time * 0.5 + nextNode.phaseOffset) * nextNode.radiusVariation

        const height1 = Math.sin(time * 0.3 + node.phaseOffset) * node.heightVariation
        const height2 = Math.sin(time * 0.3 + nextNode.phaseOffset) * nextNode.heightVariation

        const positions = new Float32Array([
          Math.cos(angle1) * radius1,
          Math.sin(angle1) * radius1 + height1,
          Math.cos(time * 0.4 + node.phaseOffset) * 0.5,
          Math.cos(angle2) * radius2,
          Math.sin(angle2) * radius2 + height2,
          Math.cos(time * 0.4 + nextNode.phaseOffset) * 0.5,
        ])

        line.geometry.setAttribute('position', new BufferAttribute(positions, 3))
      }
    })
  })

  return (
    <group ref={linesRef}>
      {nodes.map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array(6)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4fc3f7"
            opacity={0.3}
            transparent
            toneMapped={false}
          />
        </line>
      ))}
    </group>
  )
}

function Globe() {
  const globeRef = useRef<Mesh>(null)
  const nodes = useMemo<NodeData[]>(() => Array.from({ length: 12 }, () => ({
    baseRadius: 2.5,
    speed: Math.random() * 0.5 + 0.3,
    offset: Math.random() * Math.PI * 2,
    radiusVariation: Math.random() * 0.3,
    heightVariation: Math.random() * 0.5,
    direction: Math.random() > 0.5 ? 1 : -1,
    phaseOffset: Math.random() * Math.PI * 2,
  })), [])

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
        
        <NetworkNodes nodes={nodes} />
        <ConnectionLines nodes={nodes} />
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

interface Stats {
  total_agents: number;
  documented_agents: number;
  active_investigators: number;
}

function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    total_agents: 0,
    documented_agents: 0,
    active_investigators: 0
  });

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    
    axios.get(`${baseURL}/stats`)
      .then(({ data }) => {
        if (data.status === "success") {
          setStats(data.data);
        }
      })
      .catch(() => {
        // Handle error silently
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12 mt-8">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{stats.total_agents}</span>
        <span className="text-sm text-muted-foreground">Agentes IA actuales</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{stats.active_investigators}</span>
        <span className="text-sm text-muted-foreground">Investigadores Activos</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{stats.documented_agents}</span>
        <span className="text-sm text-muted-foreground">Agentes Documentados</span>
      </div>
    </div>
  );
}

export function LandingHero() {
  const router = useRouter()
  
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-black">
      {/* Canvas container */}
      <div className="absolute inset-0">
        <Scene />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      
      {/* Content */}
      <div className="relative z-20 flex min-h-[100vh] items-center justify-center px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Tag line */}
            <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5">
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">
                Comunidad OpenSource
              </span>
            </div>
            
            {/* Main heading */}
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Agentes IA: La Nueva Era Comienza
            </h1>
            
            {/* Description */}
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Únete a la comunidad hispana más grande de investigación en agentes de IA. 
              Exploramos, documentamos y construimos el futuro de la inteligencia artificial juntos.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/dashboard/documentation/nuevo-agente")}
              >
                Sé un Investigador
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => document.querySelector('#join-research')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Encuentra tu Agente
              </Button>
            </div>
            
            <StatsSection />
          </div>
        </div>
      </div>
    </section>
  )
}

