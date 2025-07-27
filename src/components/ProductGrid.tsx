
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts, type Product } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  searchQuery: string;
  categoryFilter?: string;
}

const ProductGrid = ({ onProductClick, onAddToCart, searchQuery, categoryFilter }: ProductGridProps) => {
  const { data: products = [], isLoading, error } = useProducts(searchQuery, categoryFilter);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error loading products</div>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-2">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse our categories</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer rounded-3xl shadow-lg"
          onClick={() => onProductClick(product)}
        >
          <div className="relative overflow-hidden rounded-t-3xl">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            
            {/* Enhanced overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.prescription_required && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  <Pill className="w-3 h-3 mr-1" />
                  Rx Required
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                  Out of Stock
                </Badge>
              )}
              {product.original_price && product.original_price > product.price && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  <span className="animate-bounce">🔥</span> Sale
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-110 ${
                favorites.has(product.id) 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                  : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${favorites.has(product.id) ? 'fill-current scale-110' : 'hover:scale-110'}`} />
            </Button>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{product.company}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 transition-all duration-200 ${
                      i < Math.floor(product.rating || 0) 
                        ? 'fill-yellow-400 text-yellow-400 scale-110' 
                        : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-gray-500 font-medium">({product.reviews_count || 0})</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg text-gray-400 line-through font-medium">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-sm font-semibold text-emerald-600">
                    Save ${(product.original_price - product.price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <Button 
              className={`w-full transition-all duration-300 hover:shadow-xl rounded-2xl py-6 text-base font-semibold ${
                product.stock_quantity === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white hover:scale-105 shadow-lg'
              }`}
              size="lg"
              disabled={product.stock_quantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
