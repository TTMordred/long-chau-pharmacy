
import { useState } from 'react';
import { X, Plus, Minus, Upload, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Product Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      SALE
                    </Badge>
                  )}
                </div>

                {product.prescription && !prescriptionUploaded && (
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-orange-800">Prescription Required</h4>
                          <p className="text-sm text-orange-600">Upload your prescription to continue</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-3 bg-orange-600 hover:bg-orange-700"
                        onClick={() => setPrescriptionUploaded(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Prescription
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {prescriptionUploaded && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800">Prescription Uploaded</h4>
                          <p className="text-sm text-green-600">Under pharmacist review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                  <p className="text-muted-foreground">{product.company}</p>
                </div>

                <Badge 
                  className={`${
                    product.status === 'Available' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {product.status}
                </Badge>

                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating!) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Medicine is the science and practice of establishing the diagnosis, prognosis, 
                    treatment, and prevention of disease. Medicine encompasses a variety of 
                    health care practices evolved to maintain and restore health by the 
                    prevention and treatment of illness.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Select Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={product.status === 'Out of Stock' || (product.prescription && !prescriptionUploaded)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={product.status === 'Out of Stock' || (product.prescription && !prescriptionUploaded)}
                    >
                      Add to Cart
                    </Button>
                  </div>
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
