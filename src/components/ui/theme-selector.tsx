"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { MonitorSmartphone, Moon, Sun } from "lucide-react";

export const ThemeSelector = () => {
  const { theme, themes, setTheme } = useTheme();
  const mounted = useMounted()

  if (!mounted) return null;

  return (
    <motion.div className="bg-secondary-foreground/5 border-border grid w-full grid-cols-3 rounded-md border px-1 py-0.5 gap-1">
      {themes.map((t) => (
        <motion.button
          key={t}
          className={cn(
            "relative flex items-center justify-center rounded-sm p-1 transition-colors duration-200",
            theme === t
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
          onClick={() => setTheme(t)}
        >
          {t === "light" && <Sun className="z-[2] size-3.5 stroke-[1.5]" />}
          {t === "dark" && <Moon className="z-[2] size-3.5 stroke-[1.5]" />}
          {t === "system" && (
            <MonitorSmartphone className="z-[2] size-3.5 stroke-[1.5]" />
          )}
          {theme === t && (
            <motion.div
              className="bg-muted border-primary absolute inset-0 z-[1] rounded-sm border"
              layoutId="active-theme"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};
