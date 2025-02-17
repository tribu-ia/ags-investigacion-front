"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const navigationLinks = [
  {
    title: "¿Qué hacemos?",
    href: "#features",
  },
  {
    title: "¿Cómo lo hacemos?",
    href: "#how-it-works",
  },
  // {
  //   title: "Encuentra tu agente",
  //   href: "#join-research",
  // },
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container h-full">
        <div className="flex h-full items-center justify-between md:block">
          <div className="flex flex-col justify-center h-full items-center md:flex-row  md:justify-between">
            {/* Logo y navegación principal */}
            <Link href="/" className="sm:max-w-[80px] lg:max-w-[150px] md:static">
              <Image
                src="/tribuai-agentes.png"
                alt="TribuIA Logo"
                width={150}
                height={40}
                priority
              />
            </Link>
            {/* Navegación desktop */}
            <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12">
              {navigationLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-xs lg:text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
                >
                  {link.title}
                </a>
              ))}
            </div>
            {/* By TribuIA texto */}
            <Link
              href="https://tribuia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center lg:min-w-[150px] text-cyan-400 underline"
            >
              <span className="text-xs lg:text-sm font-medium">By TribuIA</span>
            </Link>
          </div>

          {/* Botón menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

