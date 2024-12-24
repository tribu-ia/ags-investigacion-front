import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo o título */}
          <span className="font-semibold">Tribu IA</span>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
} 