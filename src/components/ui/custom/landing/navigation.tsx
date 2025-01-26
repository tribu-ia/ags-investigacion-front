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
    title: "Encuentra tu agente",
    href: "#join-research",
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
        <div className="flex h-16 items-center justify-between md:justify-start relative">
          {/* Logo y navegación principal */}
          <div className="flex items-center justify-start gap-12 flex-grow">
            <Link href="/" className="flex items-center gap-2 absolute left-4 md:static">
              <div className="w-[35vw] md:w-[15vw] aspect-square relative -mt-[4vh] -mb-[4vh] md:-mt-[2vh] md:-mb-[2vh]">
                <Image 
                  src="/logo_2.png" 
                  alt="TribuIA Logo" 
                  fill
                  className="rounded-full object-contain"
                  priority
                />
              </div>
            </Link>
            {/* Navegación desktop */}
            <div className="hidden md:flex items-center justify-center gap-12 ml-auto mr-[18vw]">
              {navigationLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* By TribuIA texto - visible en desktop */}
          <Link
            href="https://tribuia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center absolute right-4 z-10"
          >
            <span className="text-sm font-medium">By TribuIA</span>
          </Link>

          {/* Botón menú móvil */}
          <div className="flex items-center md:hidden">
            <span className="text-sm font-medium mr-4">By TribuIA</span>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
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
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

