import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-blue text-primary-foreground hover:from-primary/90 hover:to-blue/90 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 hover:rotate-1",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary to-mint text-secondary-foreground hover:from-secondary/90 hover:to-mint/90 hover:scale-110 hover:shadow-lg hover:shadow-secondary/25 hover:rotate-1",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-600/90 hover:scale-110 hover:shadow-lg hover:shadow-destructive/25 hover:rotate-1 animate-pulse",
        outline: "text-foreground border-border hover:bg-accent hover:scale-110 hover:shadow-md hover:rotate-1 backdrop-blur-sm",
        success:
          "border-transparent bg-gradient-to-r from-success to-emerald-500 text-white hover:from-success/90 hover:to-emerald-500/90 hover:scale-110 hover:shadow-lg hover:shadow-success/25 hover:rotate-1",
        warning:
          "border-transparent bg-gradient-to-r from-warning to-amber-400 text-navy hover:from-warning/90 hover:to-amber-400/90 hover:scale-110 hover:shadow-lg hover:shadow-warning/25 hover:rotate-1",
        info:
          "border-transparent bg-gradient-to-r from-info to-blue-400 text-white hover:from-info/90 hover:to-blue-400/90 hover:scale-110 hover:shadow-lg hover:shadow-info/25 hover:rotate-1",
        ocean:
          "border-transparent bg-gradient-to-r from-ocean via-blue to-teal text-white hover:from-ocean/90 hover:via-blue/90 hover:to-teal/90 hover:scale-110 hover:shadow-xl hover:shadow-ocean/30 hover:rotate-1",
        mint:
          "border-transparent bg-gradient-to-r from-mint via-sage to-seafoam text-navy hover:from-mint/90 hover:via-sage/90 hover:to-seafoam/90 hover:scale-110 hover:shadow-lg hover:shadow-mint/25 hover:rotate-1",
        glass:
          "glass border-white/30 text-foreground hover:border-primary/40 hover:scale-110 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:rotate-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        teal:
          "border-transparent bg-gradient-to-r from-teal via-seafoam to-mint text-white hover:from-teal/90 hover:via-seafoam/90 hover:to-mint/90 hover:scale-110 hover:shadow-lg hover:shadow-teal/25 hover:rotate-1",
        lavender:
          "border-transparent bg-gradient-to-r from-lavender via-violet to-indigo text-navy hover:from-lavender/90 hover:via-violet/90 hover:to-indigo/90 hover:scale-110 hover:shadow-lg hover:shadow-lavender/25 hover:rotate-1",
        cream:
          "border-transparent bg-gradient-to-r from-cream via-pearl to-amber text-navy hover:from-cream/90 hover:via-pearl/90 hover:to-amber/90 hover:scale-110 hover:shadow-lg hover:shadow-cream/25 hover:rotate-1",
        premium:
          "border-transparent bg-gradient-to-r from-violet via-indigo to-blue text-white hover:from-violet/90 hover:via-indigo/90 hover:to-blue/90 hover:scale-110 hover:shadow-xl hover:shadow-violet/30 hover:rotate-1 animate-gradient",
        cosmic:
          "border-transparent bg-gradient-to-r from-navy via-ocean to-blue text-white hover:from-navy/90 hover:via-ocean/90 hover:to-blue/90 hover:scale-110 hover:shadow-xl hover:shadow-navy/30 hover:rotate-1 animate-gradient",
        coral:
          "border-transparent bg-gradient-to-r from-coral via-rose to-pink-400 text-white hover:from-coral/90 hover:via-rose/90 hover:to-pink-400/90 hover:scale-110 hover:shadow-lg hover:shadow-coral/25 hover:rotate-1",
      },
      size: {
        default: "px-3 py-1 text-xs rounded-full",
        sm: "px-2 py-0.5 text-xs rounded-full",
        lg: "px-4 py-1.5 text-sm rounded-2xl",
        xl: "px-6 py-2 text-base rounded-2xl",
        "2xl": "px-8 py-3 text-lg rounded-3xl",
        pill: "px-4 py-1 text-xs rounded-full",
        "pill-lg": "px-6 py-2 text-sm rounded-full",
      },
      effect: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        ping: "animate-ping",
        glow: "glow-hover",
        shimmer: "btn-shimmer",
        float: "animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, effect, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, effect }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
