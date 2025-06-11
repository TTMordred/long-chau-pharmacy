
import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  originalPrice?: number;
  image: string;
  status: 'Available' | 'Out of Stock';
  prescription?: boolean;
  rating?: number;
  reviews?: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    company: "Pharma Corp",
    price: 10.99,
    originalPrice: 12.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Available",
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    name: "Vitamin D3 Capsules",
    company: "HealthLife",
    price: 15.50,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Available",
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: "Amoxicillin 250mg",
    company: "MediCare Ltd",
    price: 8.75,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Available",
    prescription: true,
    rating: 4.2,
    reviews: 56
  },
  {
    id: 4,
    name: "Blood Pressure Monitor",
    company: "TechMed",
    price: 45.00,
    originalPrice: 55.00,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Available",
    rating: 4.6,
    reviews: 203
  },
  {
    id: 5,
    name: "First Aid Kit",
    company: "SafeGuard",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Out of Stock",
    rating: 4.3,
    reviews: 74
  },
  {
    id: 6,
    name: "Omega-3 Fish Oil",
    company: "NutriMax",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    status: "Available",
    rating: 4.7,
    reviews: 145
  }
];

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
}

const ProductGrid = ({ onProductClick, onAddToCart, searchQuery }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card 
          key={product.id} 
          className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white border border-border"
        >
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => onProductClick(product)}
              />
              
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white ${
                  favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
              >
                <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
              </Button>

              {product.originalPrice && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  SALE
                </Badge>
              )}

              {product.prescription && (
                <Badge className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs">
                  Prescription Required
                </Badge>
              )}

              <Badge 
                className={`absolute bottom-2 right-2 text-xs ${
                  product.status === 'Available' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}
              >
                {product.status}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <div onClick={() => onProductClick(product)}>
                <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">{product.company}</p>
              </div>

              {product.rating && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-muted-foreground">({product.reviews})</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={product.status === 'Out of Stock'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
