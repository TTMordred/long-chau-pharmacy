
import { useState } from 'react';
import { X, Plus, Minus, Star, Upload, Prescription, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/hooks/useProducts';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-300">
        <Card className="bg-white shadow-2xl border-0 rounded-xl">
          <CardHeader className="border-b relative p-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop'}
                  alt={product.name}
                  className="w-full h-80 md:h-full object-cover rounded-l-xl"
                />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.prescription_required && (
                    <Badge className="bg-red-500 text-white">
                      <Prescription className="w-3 h-3 mr-1" />
                      Prescription Required
                    </Badge>
                  )}
                  {product.original_price && product.original_price > product.price && (
                    <Badge className="bg-green-500 text-white">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                  }`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                  <p className="text-muted-foreground">{product.company}</p>
                  
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
                    <span className="text-3xl font-bold text-primary">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Stock: </span>
                    <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {product.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Prescription Upload */}
                {product.prescription_required && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Prescription className="w-5 h-5" />
                      <h3 className="font-semibold">Prescription Required</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="prescription" className="text-sm font-medium">
                          Upload Prescription
                        </Label>
                        <Input
                          id="prescription"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special instructions or notes for the pharmacist..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      
                      {prescriptionFile && (
                        <div className="text-sm text-green-600">
                          ✓ Prescription uploaded: {prescriptionFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="font-semibold">Quantity:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery:</span>
                      <span>Free</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 text-base transition-all duration-300 hover:shadow-lg" 
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0 || (product.prescription_required && !prescriptionFile)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>

                  {product.prescription_required && !prescriptionFile && (
                    <p className="text-xs text-red-600 text-center">
                      Please upload a valid prescription to add this item to cart
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductModal;
