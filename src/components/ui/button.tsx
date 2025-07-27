import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-primary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-destructive/25",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-secondary/25",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        gradient: "bg-gradient-to-r from-primary to-blue text-primary-foreground hover:from-primary/90 hover:to-blue/90 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-primary/30",
        ocean: "bg-gradient-to-r from-ocean to-blue text-white hover:from-ocean/90 hover:to-blue/90 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-ocean/30",
        mint: "bg-gradient-to-r from-mint to-sage text-navy hover:from-mint/90 hover:to-sage/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-mint/25",
        coral: "bg-gradient-to-r from-coral to-pearl text-navy hover:from-coral/90 hover:to-pearl/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-coral/25",
        teal: "bg-gradient-to-r from-teal to-seafoam text-white hover:from-teal/90 hover:to-seafoam/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-teal/25",
        success: "bg-success text-white hover:bg-success/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-success/25",
        warning: "bg-warning text-navy hover:bg-warning/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-warning/25",
        info: "bg-info text-white hover:bg-info/90 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-info/25",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      effect: {
        none: "",
        shimmer: "btn-shimmer",
        glow: "glow-hover",
        lift: "hover-lift",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, effect, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, effect, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
