
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"

const fabVariants = cva(
  "fixed z-50 shadow-lg transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90 text-white",
        secondary: "bg-gradient-to-r from-sage to-mint hover:from-sage/90 hover:to-mint/90 text-navy",
        outline: "border-2 border-blue bg-white/90 hover:bg-blue hover:text-white text-blue backdrop-blur-sm",
      },
      size: {
        sm: "h-12 w-12",
        default: "h-14 w-14",
        lg: "h-16 w-16",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
      },
      animation: {
        none: "",
        bounce: "animate-bounce",
        pulse: "animate-pulse",
        float: "animate-[float_3s_ease-in-out_infinite]",
        scale: "hover:scale-110 active:scale-95",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
      animation: "scale",
    },
  }
)

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  asChild?: boolean
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, variant, size, position, animation, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(
          fabVariants({ variant, size, position, animation }),
          "rounded-full shadow-xl hover:shadow-2xl",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

// Extended FAB with expandable menu
interface ExtendedFABProps extends FloatingActionButtonProps {
  actions?: Array<{
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick: () => void
    color?: string
  }>
  expanded?: boolean
  onToggle?: () => void
}

const ExtendedFAB = React.forwardRef<HTMLButtonElement, ExtendedFABProps>(
  ({ actions = [], expanded = false, onToggle, children, className, ...props }, ref) => {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Action buttons */}
        {expanded && actions.length > 0 && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-end space-x-3 animate-in fade-in-0 slide-in-from-right-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-sm font-medium text-navy bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-white/20">
                  {action.label}
                </span>
                <Button
                  onClick={action.onClick}
                  size="sm"
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110",
                    action.color || "bg-white/90 hover:bg-white text-navy border border-white/20"
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Main FAB */}
        <FloatingActionButton
          ref={ref}
          onClick={onToggle}
          className={cn(
            "transition-transform duration-300",
            expanded && "rotate-45",
            className
          )}
          {...props}
        >
          {children}
        </FloatingActionButton>
      </div>
    )
  }
)
ExtendedFAB.displayName = "ExtendedFAB"

export { FloatingActionButton, ExtendedFAB, fabVariants }
