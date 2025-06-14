
import { useState } from 'react'
import { X, ShoppingCart, Heart, Star, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImageGallery } from '@/components/ui/product-image-gallery'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/hooks/useProducts'

interface ProductQuickViewProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

const ProductQuickView = ({ product, onClose, onAddToCart }: ProductQuickViewProps) => {
  const [quantity, setQuantity] = useState(1)
  const { isInWishlist, toggleWishlist } = useWishlist()

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onClose()
  }

  const images = product.image_url ? [product.image_url] : []

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-xl shadow-2xl border-0 m-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product Images */}
              <div className="p-6">
                <ProductImageGallery 
                  images={images}
                  productName={product.name}
                />
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                      <p className="text-sm text-muted-foreground">{product.company}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isInWishlist(product.id) 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-500'
                      }`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 0) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating?.toFixed(1)} ({product.reviews_count || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {product.prescription_required && (
                      <Badge variant="destructive">Prescription Required</Badge>
                    )}
                    {product.stock_quantity === 0 && (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                    {product.original_price && product.original_price > product.price && (
                      <Badge className="bg-green-500 text-white">Sale</Badge>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-11 transition-all duration-300 hover:shadow-lg" 
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductQuickView
