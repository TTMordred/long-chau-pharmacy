import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border hover:shadow-md hover:shadow-primary/5",
        elevated: "shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        glass: "glass border-white/20 hover:bg-card/90 hover:border-white/30 backdrop-blur-xl",
        gradient: "bg-gradient-to-br from-surface-1 to-surface-2 border-border/50 hover:from-surface-1/90 hover:to-surface-2/90",
        ocean: "bg-gradient-to-br from-ocean/10 to-blue/10 border-blue/20 hover:from-ocean/15 hover:to-blue/15",
        mint: "bg-gradient-to-br from-mint/20 to-sage/20 border-mint/30 hover:from-mint/25 hover:to-sage/25",
        coral: "bg-gradient-to-br from-coral/10 to-pearl/20 border-coral/20 hover:from-coral/15 hover:to-pearl/25",
        teal: "bg-gradient-to-br from-teal/10 to-seafoam/15 border-teal/20 hover:from-teal/15 hover:to-seafoam/20",
        interactive: "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/15 cursor-pointer",
        soft: "border-0 shadow-md bg-gradient-to-br from-surface-1 to-surface-2 hover:shadow-lg hover:from-surface-1/90 hover:to-surface-2/90",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
