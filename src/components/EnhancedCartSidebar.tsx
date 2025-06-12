
import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import AuthModal from '@/components/AuthModal';

interface EnhancedCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedCartSidebar = ({ isOpen, onClose }: EnhancedCartSidebarProps) => {
  const { cartItems, cartTotal, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            company: item.company,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url
          })),
          deliveryAddress
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform animate-in slide-in-from-right duration-300">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b bg-gradient-to-r from-blue to-navy text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="w-5 h-5" />
                My Cart ({cartItems.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-full p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Your cart is empty</p>
                  <p className="text-sm mt-1">Add some products to get started</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.company}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">${item.price}</span>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={() => updateQuantity({ productId: item.id, newQuantity: item.quantity - 1 })}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={() => updateQuantity({ productId: item.id, newQuantity: item.quantity + 1 })}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-gradient-to-r from-slate-50 to-blue-50">
                {user && (
                  <div className="space-y-2">
                    <Label htmlFor="delivery-address">Delivery Address</Label>
                    <Input
                      id="delivery-address"
                      placeholder="Enter your delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90 transition-all duration-300 hover:shadow-lg"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                    </>
                  )}
                </Button>

                {cartItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default EnhancedCartSidebar;
