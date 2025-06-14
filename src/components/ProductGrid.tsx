
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Pill, Eye, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts, type Product } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { useProductComparison } from '@/hooks/useProductComparison';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
  categoryFilter?: string;
}

const ProductGrid = ({ onProductClick, onAddToCart, onQuickView, searchQuery, categoryFilter }: ProductGridProps) => {
  const { data: products = [], isLoading, error } = useProducts(searchQuery, categoryFilter);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToComparison, isInComparison, comparisonCount } = useProductComparison();
  const { toast } = useToast();

  const handleAddToComparison = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = addToComparison(product);
    if (success) {
      toast({
        title: "Added to comparison",
        description: `${product.name} has been added to your comparison list.`,
      });
    } else if (comparisonCount >= 4) {
      toast({
        title: "Comparison limit reached",
        description: "You can only compare up to 4 products at once.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <EnhancedSkeleton key={i} className="h-80 rounded-xl" />
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
        <div className="text-4xl mb-4">🔍</div>
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
          className="group overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg cursor-pointer bg-white hover-lift"
          onClick={() => onProductClick(product)}
        >
          <div className="relative overflow-hidden">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.prescription_required && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                  <Pill className="w-3 h-3 mr-1" />
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

            {/* Simplified action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${
                  isInWishlist(product.id) 
                    ? 'text-red-500' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${
                  isInComparison(product.id)
                    ? 'text-blue-500'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={(e) => handleAddToComparison(product, e)}
              >
                <GitCompare className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
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
                  <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
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
