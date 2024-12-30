"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

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
    <div className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Agentes IA</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigationLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
              >
                {link.title}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
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
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4 bg-background border-t">
            {navigationLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm cursor-pointer"
              >
                {link.title}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

