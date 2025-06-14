
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Pill, Eye } from 'lucide-react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden glass-card">
            <Skeleton className="h-64 w-full loading-shimmer" />
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-3/4 loading-shimmer" />
              <Skeleton className="h-4 w-1/2 loading-shimmer" />
              <Skeleton className="h-6 w-1/4 loading-shimmer" />
              <Skeleton className="h-10 w-full loading-shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4 text-2xl">⚠️</div>
        <div className="text-red-600 mb-2 text-xl font-semibold">Error loading products</div>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">No products found</h3>
        <p className="text-gray-500 text-lg">Try adjusting your search or browse our categories</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <Card 
          key={product.id} 
          className="group overflow-hidden border-0 glass-card hover:shadow-elegant-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer card-hover"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onProductClick(product)}
        >
          <div className="relative overflow-hidden">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.prescription_required && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 shadow-lg">
                  <Pill className="w-3 h-3 mr-1" />
                  Rx Required
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="destructive" className="text-xs px-3 py-1 shadow-lg">
                  Out of Stock
                </Badge>
              )}
              {product.original_price && product.original_price > product.price && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 shadow-lg">
                  Sale
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant="ghost"
                size="sm"
                className={`p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 ${
                  favorites.has(product.id) 
                    ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                    : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
              >
                <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-3 rounded-full bg-white/90 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(product);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{product.company}</p>
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
              <span className="text-sm text-gray-500">({product.reviews_count || 0})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-elegant" 
              size="lg"
              disabled={product.stock_quantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
