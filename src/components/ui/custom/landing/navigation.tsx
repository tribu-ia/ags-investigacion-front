"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Brain } from "lucide-react"

const navigationLinks = [
  {
    title: "¿Qué Hacemos?",
    href: "#features",
  },
  {
    title: "¿Cómo lo Hacemos?",
    href: "#how-it-works",
  },
  {
    title: "Sé un Investigador",
    href: "#join-forms",
  },
  {
    title: "Únete",
    href: "#call-to-action",
  },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:justify-center relative">
          {/* Logo y navegación principal */}
          <div className="flex items-center justify-center gap-12">
            <Link href="/" className="flex items-center gap-2 absolute left-4 md:static">
              <Brain className="h-6 w-6" />
              <span className="text-xl font-bold">Agentes Tribu IA</span>
            </Link>
            {/* Navegación desktop */}
            <div className="hidden md:flex items-center justify-center gap-12">
              {navigationLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Link a TribuIA */}
          <a
            href="https://tribuia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 absolute right-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            By <span className="font-semibold">TribuIA</span>
            <div className="h-10 w-10 relative">
              <Image 
                src="/logo.png" 
                alt="TribuIA Logo" 
                fill
                className="rounded-full object-contain"
              />
            </div>
          </a>

          {/* Botón menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute right-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40">
            <div className="flex flex-col items-center py-4 space-y-4">
              {navigationLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2"
                >
                  {link.title}
                </a>
              ))}
              <a
                href="https://tribuia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2"
              >
                By TribuIA
                <div className="h-8 w-8 relative">
                  <Image 
                    src="/logo.png" 
                    alt="TribuIA Logo" 
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

