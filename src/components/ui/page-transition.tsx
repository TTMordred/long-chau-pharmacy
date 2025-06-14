
import React from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  variant?: 'fade' | 'slide' | 'scale' | 'blur'
  duration?: 'fast' | 'normal' | 'slow'
}

const PageTransition = ({ 
  children, 
  className,
  variant = 'fade',
  duration = 'normal'
}: PageTransitionProps) => {
  const variants = {
    fade: 'animate-in fade-in-0',
    slide: 'animate-in slide-in-from-bottom-4 fade-in-0',
    scale: 'animate-in zoom-in-95 fade-in-0',
    blur: 'animate-in fade-in-0'
  }
  
  const durations = {
    fast: 'duration-200',
    normal: 'duration-500',
    slow: 'duration-700'
  }

  return (
    <div className={cn(
      variants[variant],
      durations[duration],
      variant === 'blur' && 'backdrop-blur-sm',
      className
    )}>
      {children}
    </div>
  )
}

export { PageTransition }
