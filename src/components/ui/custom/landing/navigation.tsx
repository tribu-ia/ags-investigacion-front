"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain } from 'lucide-react'
import Link from "next/link"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold">AgentesIA</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary"
          >
            Características
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary"
          >
            Cómo Funciona
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary"
          >
            Precios
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Iniciar Sesión
          </Button>
          <Button size="sm">Registrarse</Button>
        </div>
      </div>
    </header>
  )
}

