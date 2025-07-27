import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary",
        filled: "bg-surface-1 border-transparent focus:bg-background focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/20",
        glass: "glass border-white/20 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
        success: "border-success focus:border-success focus-visible:ring-2 focus-visible:ring-success/20",
        error: "border-destructive focus:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20",
        warning: "border-warning focus:border-warning focus-visible:ring-2 focus-visible:ring-warning/20",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-lg",
        xl: "h-14 px-5 py-4 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
