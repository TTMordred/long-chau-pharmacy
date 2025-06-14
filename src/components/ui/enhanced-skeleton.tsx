
import { cn } from "@/lib/utils"

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'product' | 'text' | 'avatar' | 'button'
  animation?: 'pulse' | 'wave' | 'shimmer'
}

function EnhancedSkeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  ...props
}: EnhancedSkeletonProps) {
  const baseClasses = "rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted"
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-48 w-full",
    product: "aspect-square w-full",
    text: "h-4 w-3/4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded-lg"
  }
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse",
    shimmer: "animate-pulse bg-gradient-to-r from-muted via-muted/30 to-muted bg-[length:400%_100%] animate-[shimmer_2s_infinite]"
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  )
}

const ProductSkeleton = () => (
  <div className="space-y-4 p-4 border rounded-lg bg-white/50 backdrop-blur-sm">
    <EnhancedSkeleton variant="product" />
    <div className="space-y-2">
      <EnhancedSkeleton variant="text" className="w-full" />
      <EnhancedSkeleton variant="text" className="w-2/3" />
      <div className="flex justify-between items-center">
        <EnhancedSkeleton variant="button" className="w-16" />
        <EnhancedSkeleton variant="button" />
      </div>
    </div>
  </div>
)

const BlogPostSkeleton = () => (
  <div className="space-y-4 p-6 border rounded-lg bg-white/50 backdrop-blur-sm">
    <EnhancedSkeleton variant="card" className="h-48" />
    <div className="space-y-3">
      <EnhancedSkeleton className="h-6 w-3/4" />
      <EnhancedSkeleton className="h-4 w-full" />
      <EnhancedSkeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-3 mt-4">
        <EnhancedSkeleton variant="avatar" />
        <div className="space-y-1">
          <EnhancedSkeleton className="h-3 w-20" />
          <EnhancedSkeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
)

export { EnhancedSkeleton, ProductSkeleton, BlogPostSkeleton }
