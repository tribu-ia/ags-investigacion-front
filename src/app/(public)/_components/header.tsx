"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRightCircle, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

const ROUTES = [
  {
    title: "¿Qué hacemos?",
    href: "#what-we-do",
  },
  {
    title: "¿Cómo lo hacemos?",
    href: "#how-it-works",
  },
  {
    title: "Encuentra tu agente",
    href: "#find-your-agent",
  },
  {
    title: "Únete",
    href: "#get-started",
  },
];

export const HeaderLanding = () => {
  const [open, setOpen] = useState(false);

  const handleMobileClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);

    if (targetElement) {
      setOpen(false);
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;

      if (target.hash && target.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetElement = document.querySelector(target.hash);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    const links = document.querySelectorAll("a[data-type='header-link:l:']");

    links.forEach((link) => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <Link
            className="text-md font-bold hover:opacity-80 transition-opacity duration-200"
            href="/"
          >
            <div className="flex items-center">
              <span className="text-primary">Tribu</span>
              <span className="text-accent-foreground">iA</span>
              <span className="text-primary mx-0.5 font-light">/</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-foreground via-primary to-accent-foreground tracking-wider uppercase text-sm">
                Agentes
              </span>
            </div>
          </Link>
          <nav className="ml-auto flex items-center space-x-6 text-sm font-medium">
            <div className="hidden items-center space-x-4 lg:flex">
              {ROUTES.map((route) => (
                <Link
                  key={route.title}
                  className="transition-colors hover:text-foreground/80"
                  href={route.href}
                  data-type="header-link:l:"
                >
                  {route.title}
                </Link>
              ))}
            </div>
            <Button className="px-2 py-1 h-auto" asChild>
              <Link
                href="https://tribuia.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                By TribuIA
              </Link>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="lg:hidden" aria-label="Menu">
                <Menu className="size-6 text-foreground/80" />
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-5 items-center rounded-lg">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center text-lg">
                      <span className="text-primary">Tribu</span>
                      <span className="text-accent-foreground">iA</span>
                      <span className="text-primary mx-0.5 font-light">/</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-foreground via-primary to-accent-foreground tracking-wider uppercase">
                        Agentes
                      </span>
                    </div>
                  </DialogTitle>
                  <DialogDescription className="hidden" hidden />
                </DialogHeader>
                <nav className="flex flex-col gap-4 w-full p-4">
                  <Link
                    className="group hover:text-foreground/80 relative flex items-center gap-3 border border-accent-foreground/20 rounded-md px-4 py-2 ring-0 hover:ring-2 hover:ring-offset-1 hover:ring-offset-background hover:border-primary/50 transition-all duration-200"
                    href="#welcome-community"
                    data-type="header-link:l:"
                    onClick={(e) => handleMobileClick(e, "#welcome-community")}
                  >
                    <ArrowRightCircle className="size-4 opacity-0 absolute left-3 -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 text-primary/70 transition-all duration-300 ease-out" />
                    <span className="group-hover:pl-7 transition-all duration-300 ease-out">
                      Inicio
                    </span>
                  </Link>
                  {ROUTES.map((route) => (
                    <Link
                      key={route.title}
                      className="group hover:text-foreground/80 relative flex items-center gap-3 border border-accent-foreground/20 rounded-md px-4 py-2 ring-0 hover:ring-2 hover:ring-offset-1 hover:ring-offset-background hover:border-primary/50 transition-all duration-200"
                      href={route.href}
                      data-type="header-link:l:"
                      onClick={(e) => handleMobileClick(e, route.href)}
                    >
                      <ArrowRightCircle className="size-4 opacity-0 absolute left-3 -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 text-primary/70 transition-all duration-300 ease-out" />
                      <span className="group-hover:pl-7 transition-all duration-300 ease-out">
                        {route.title}
                      </span>
                    </Link>
                  ))}
                </nav>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </div>
    </header>
  );
};
