"use client";

import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="button-secondary inline-flex items-center gap-2 px-3.5"
      onClick={onToggle}
      aria-label="Cambiar tema"
    >
      <span className="rounded-full bg-brand-100 p-1 text-brand-700 dark:bg-slate-600 dark:text-brand-100">
        {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
      </span>
      <span className="text-xs sm:text-sm">{theme === "light" ? "Modo oscuro" : "Modo claro"}</span>
    </button>
  );
}
