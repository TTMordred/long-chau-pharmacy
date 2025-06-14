
import { X, ShoppingCart, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductComparison } from '@/hooks/useProductComparison'
import type { Product } from '@/hooks/useProducts'

interface ProductComparisonModalProps {
  onClose: () => void
  onAddToCart: (product: Product, quantity?: number) => void
}

const ProductComparisonModal = ({ onClose, onAddToCart }: ProductComparisonModalProps) => {
  const { comparisonList, removeFromComparison, clearComparison } = useProductComparison()

  if (comparisonList.length === 0) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity animate-in fade-in duration-300"
          onClick={onClose}
        />
        
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-95 duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">No Products to Compare</h2>
            <p className="text-muted-foreground mb-6">Add products to your comparison list to see them here.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed inset-4 z-50 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-xl shadow-2xl h-full overflow-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Product Comparison</h2>
              <Badge variant="secondary">{comparisonList.length} Products</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearComparison}>
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-fit">
                {comparisonList.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-4 min-w-[280px]">
                    <div className="relative">
                      <img 
                        src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
                        onClick={() => removeFromComparison(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.company}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating || 0) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews_count || 0})
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">${product.price}</span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                ${product.original_price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Prescription:</span>
                          <span className={product.prescription_required ? 'text-red-600' : 'text-green-600'}>
                            {product.prescription_required ? 'Required' : 'Not required'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {product.prescription_required && (
                          <Badge variant="destructive" className="text-xs">Prescription Required</Badge>
                        )}
                        {product.original_price && product.original_price > product.price && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Save ${(product.original_price - product.price).toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className="w-full" 
                        size="sm"
                        disabled={product.stock_quantity === 0}
                        onClick={() => onAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductComparisonModal
