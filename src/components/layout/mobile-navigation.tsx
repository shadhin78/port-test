"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { NavLink } from "@/components/layout/nav-link";
import type { NavItem } from "@/config/navigation";

type MobileNavigationProps = {
  items: readonly NavItem[];
};

/**
 * Disclosure-style menu for small screens: a button toggles a list of links.
 * Escape closes it and returns focus to the button; choosing a link closes it.
 */
export function MobileNavigation({ items }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors duration-150 hover:bg-surface-elevated hover:text-fg"
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>

      <nav
        id={panelId}
        aria-label="Mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background px-5 pt-2 pb-5 shadow-lg shadow-black/20 sm:px-8"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                onNavigate={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-border text-base text-muted transition-colors hover:text-fg"
                activeClassName="font-medium text-fg!"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
