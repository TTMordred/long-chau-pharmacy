
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

const ProductImageGallery = ({ images, productName, className }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImage = images[currentImageIndex] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop'

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          <img 
            src={currentImage}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsZoomed(true)}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                currentImageIndex === index 
                  ? "border-primary shadow-md" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 z-50 transition-opacity"
            onClick={() => setIsZoomed(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img 
                src={currentImage}
                alt={`${productName} - Zoomed`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                onClick={() => setIsZoomed(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export { ProductImageGallery }
