
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [orderCleared, setOrderCleared] = useState(false);

  useEffect(() => {
    if (sessionId && !orderCleared) {
      // Clear the cart after successful payment
      clearCart();
      setOrderCleared(true);
    }
  }, [sessionId, clearCart, orderCleared]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage via-mint to-blue/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-navy">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-navy/70">
              Thank you for your order! Your payment has been processed successfully.
            </p>
            
            {sessionId && (
              <div className="bg-mint/10 p-3 rounded-lg">
                <p className="text-sm text-navy/80">
                  Order ID: <span className="font-mono">{sessionId.slice(-8)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2 text-blue">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">
              Your order is being processed and will be delivered soon!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <p className="text-xs text-navy/60">
            You will receive an email confirmation shortly with your order details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
