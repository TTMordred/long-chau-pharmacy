
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Prescription } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer bg-white"
          onClick={() => onProductClick(product)}
        >
          <div className="relative overflow-hidden">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.prescription_required && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                  <Prescription className="w-3 h-3 mr-1" />
                  Rx Required
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Out of Stock
                </Badge>
              )}
              {product.original_price && product.original_price > product.price && (
                <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                  Sale
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                favorites.has(product.id) 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
            >
              <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
            </Button>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>

          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{product.company}</p>
            </div>

            <div className="flex items-center gap-1 text-xs">
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
              <span className="text-muted-foreground">({product.reviews_count || 0})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button 
              className="w-full transition-all duration-300 hover:shadow-lg" 
              size="sm"
              disabled={product.stock_quantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
