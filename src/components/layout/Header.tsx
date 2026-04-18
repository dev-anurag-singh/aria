"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  scrolled?: boolean;
}

export function Header({ scrolled }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-[backdrop-filter,background-color] duration-300 ${scrolled ? "backdrop-blur-xl bg-white/30 dark:bg-black/20 border-b border-white/20 dark:border-white/10" : ""}`}>
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-lg font-semibold tracking-tight"
      >
        Aria
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative rounded-full backdrop-blur-sm bg-white/50 hover:bg-white/70 border border-white/70 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10"
          aria-label="Toggle theme"
        >
          <Sun className="inline-block dark:hidden" />
          <Moon className="hidden dark:inline-block" />
        </Button>
      </motion.div>
    </header>
  );
}
