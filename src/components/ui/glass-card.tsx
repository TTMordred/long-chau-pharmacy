
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const glassCardVariants = cva(
  "relative backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/10 hover:bg-white/15",
        frosted: "bg-white/20 hover:bg-white/25",
        tinted: "bg-gradient-to-br from-blue/10 to-sage/10 hover:from-blue/15 hover:to-sage/15",
        dark: "bg-black/10 hover:bg-black/15 border-white/10",
      },
      size: {
        sm: "p-4 rounded-lg",
        default: "p-6 rounded-xl",
        lg: "p-8 rounded-2xl",
      },
      hover: {
        none: "",
        lift: "hover:scale-[1.02] hover:shadow-2xl",
        glow: "hover:shadow-[0_0_30px_rgba(122,178,211,0.3)]",
        float: "hover:-translate-y-1 hover:shadow-2xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "lift",
    },
  }
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  asChild?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, hover, asChild = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(glassCardVariants({ variant, size, hover, className }))}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-inherit pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight text-navy", className)}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-navy/80", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

export { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, glassCardVariants }
