"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** The server (and first hydration pass) always assume the default dark theme. */
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be unavailable (private mode). The choice still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors duration-150 hover:bg-surface-elevated hover:text-fg"
    >
      {/* Icons are swapped with CSS so the right one shows before hydration. */}
      <Sun aria-hidden="true" className="theme-icon-light size-5" />
      <Moon aria-hidden="true" className="theme-icon-dark size-5" />
    </button>
  );
}
