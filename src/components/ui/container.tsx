import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = {
  as?: T;
  /** `narrow` suits long-form reading; `default` suits grids. */
  size?: "default" | "narrow";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Centered, responsive page-width wrapper with consistent gutters. */
export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
