"use client";

import { cn } from "@/lib/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex flex-none cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-medium whitespace-nowrap capitalize transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-800 hover:bg-brand-800/90 text-white",
        secondary: "bg-stone-100 hover:bg-stone-200 text-stone-800",
      },
      scale: {
        md: "h-10 px-4 py-2",
        lg: "h-12 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      scale: "md",
    },
  }
);

function Button({
  className,
  variant,
  scale,
  asChild = false,
  loading,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, scale, className }))}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2Icon className="animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
