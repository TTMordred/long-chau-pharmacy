
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue to-navy text-white hover:from-blue/90 hover:to-navy/90 shadow-md hover:shadow-lg",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-blue transition-colors",
        secondary: "bg-gradient-to-r from-sage to-mint text-navy hover:from-sage/90 hover:to-mint/90 shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-navy hover:bg-white/20 shadow-xl hover:shadow-2xl",
        glow: "bg-gradient-to-r from-blue to-navy text-white shadow-lg hover:shadow-[0_0_30px_rgba(122,178,211,0.5)] hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-14 rounded-lg px-10 text-base",
      },
      animation: {
        none: "",
        scale: "hover:scale-105 active:scale-95",
        lift: "hover:-translate-y-0.5 hover:shadow-lg",
        ripple: "before:absolute before:inset-0 before:bg-white/20 before:scale-0 before:rounded-full before:transition-transform hover:before:scale-100",
        shimmer: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: "left" | "right"
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation, 
    asChild = false, 
    loading = false,
    icon: Icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {animation === "shimmer" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        )}
        
        {/* Ripple effect overlay */}
        {animation === "ripple" && (
          <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-hover:scale-100 transition-transform duration-300" />
        )}
        
        <div className="relative z-10 flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
              {children}
              {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
            </>
          )}
        </div>
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }
