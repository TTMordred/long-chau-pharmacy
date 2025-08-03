import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, AlertTriangle, CheckCircle, XCircle, Package, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderPresenter, PrescriptionOrderItem } from '@/com/longchau/pms/ui/presenter/OrderPresenter';
import { FileBasedOrderRepository } from '@/com/longchau/pms/persistence/file/FileBasedOrderRepository';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { FileBasedProductRepository } from '@/com/longchau/pms/persistence/file/FileBasedProductRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';
import { Product } from '@/com/longchau/pms/domain/Product';

interface StaffOrderingFrameProps {
  customerId: string;
  prescriptions: Prescription[];
}

interface OrderItem extends PrescriptionOrderItem {
  productName: string;
  prescriptionId?: string;
  isValid: boolean;
  errorMessage?: string;
}

export const StaffOrderingFrame: React.FC<StaffOrderingFrameProps> = ({
  customerId,
  prescriptions
}) => {
  const productRepository = new FileBasedProductRepository();
  const [presenter] = useState(() => 
    new OrderPresenter(
      new FileBasedOrderRepository(productRepository),
      new FileBasedPrescriptionRepository(),
      productRepository
    )
  );

  // State management
  const [prescriptionProducts, setPrescriptionProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<Set<string>>(new Set());
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    loadPrescriptionProducts();
    setCustomerName(`Customer ${customerId.slice(-4)}`); // Mock customer name
  }, []);

  const loadPrescriptionProducts = async () => {
    try {
      const products = await presenter.getPrescriptionRequiredProducts();
      setPrescriptionProducts(products);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load prescription products' });
    }
  };

  const validatePrescription = (prescriptionId: string): { isValid: boolean; message: string } => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    
    if (!prescription) {
      return { isValid: false, message: 'Prescription not found' };
    }

    if (prescription.status === 'pending') {
      return { isValid: false, message: 'Prescription requires validation - Please get pharmacist approval first' };
    }

    if (prescription.status === 'rejected') {
      return { isValid: false, message: 'Prescription has been rejected and cannot be used' };
    }

    if (prescription.status === 'approved') {
      return { isValid: true, message: 'Prescription is validated and approved' };
    }

    return { isValid: false, message: 'Invalid prescription status' };
  };

  const addPrescriptionToOrder = (prescriptionId: string, productId: string, quantity: number = 1) => {
    const validation = validatePrescription(prescriptionId);
    const product = prescriptionProducts.find(p => p.id === productId);
    
    if (!product) {
      setMessage({ type: 'error', text: 'Product not found' });
      return;
    }

    const newItem: OrderItem = {
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      prescriptionId,
      isValid: validation.isValid,
      errorMessage: validation.isValid ? undefined : validation.message
    };

    if (!validation.isValid) {
      setMessage({ 
        type: 'error', 
        text: `Cannot add prescription item: ${validation.message}` 
      });
      // Still add to order to demonstrate the error state
      setOrderItems([...orderItems, newItem]);
      return;
    }

    setOrderItems([...orderItems, newItem]);
    setSelectedPrescriptions(new Set([...selectedPrescriptions, prescriptionId]));
    setMessage({ 
      type: 'success', 
      text: `Added validated prescription item: ${product.name}` 
    });
  };

  const removeOrderItem = (index: number) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
    setMessage({ type: 'success', text: 'Item removed from order' });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = orderItems.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems
      .filter(item => item.isValid)
      .reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const getValidItems = () => {
    return orderItems.filter(item => item.isValid);
  };

  const getInvalidItems = () => {
    return orderItems.filter(item => !item.isValid);
  };

  const processOrder = async () => {
    const validItems = getValidItems();
    const invalidItems = getInvalidItems();

    if (validItems.length === 0) {
      setMessage({ type: 'error', text: 'No valid items in order. Please add validated prescription items.' });
      return;
    }

    if (invalidItems.length > 0) {
      setMessage({ 
        type: 'error', 
        text: 'Cannot process order with invalid items. Please remove non-validated prescriptions.' 
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      setMessage({ type: 'error', text: 'Please provide delivery address' });
      return;
    }

    setIsProcessingOrder(true);
    setMessage(null);

    try {
      // For demonstration, we'll create orders for each prescription separately
      const results = [];
      const groupedByPrescription = validItems.reduce((acc, item) => {
        const prescId = item.prescriptionId!;
        if (!acc[prescId]) acc[prescId] = [];
        acc[prescId].push(item);
        return acc;
      }, {} as Record<string, OrderItem[]>);

      for (const [prescriptionId, items] of Object.entries(groupedByPrescription)) {
        const prescriptionItems: PrescriptionOrderItem[] = items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }));

        const result = await presenter.createOrderFromPrescription(
          prescriptionId,
          prescriptionItems,
          deliveryAddress,
          customerId,
          notes
        );

        results.push({ prescriptionId, result });
      }

      // Process payment simulation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing

      setCompletedOrder({
        orderId: `ORD-${Date.now()}`,
        total: calculateTotal(),
        itemCount: validItems.length,
        prescriptionCount: Object.keys(groupedByPrescription).length
      });

      setShowOrderConfirmation(true);
      setOrderItems([]);
      setSelectedPrescriptions(new Set());
      setDeliveryAddress('');
      setNotes('');
      setMessage(null);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process order. Please try again.' });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const resetOrder = () => {
    setOrderItems([]);
    setSelectedPrescriptions(new Set());
    setDeliveryAddress('');
    setNotes('');
    setMessage(null);
    setShowOrderConfirmation(false);
    setCompletedOrder(null);
  };

  const getPrescriptionStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Validated</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Validation</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (showOrderConfirmation && completedOrder) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Order Completed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Order ID</div>
                <div className="font-mono font-bold">{completedOrder.orderId}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-green-600">₹{completedOrder.total.toFixed(2)}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Items</div>
                <div className="font-bold">{completedOrder.itemCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Prescriptions Used</div>
                <div className="font-bold">{completedOrder.prescriptionCount}</div>
              </div>
            </div>
            
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                Payment processed successfully. Order is being prepared for delivery.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={resetOrder} className="min-w-[150px]">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Staff Point-of-Sale Interface
          </CardTitle>
          <div className="text-sm text-gray-600">
            Customer: <span className="font-medium">{customerName}</span> | 
            ID: <span className="font-mono">{customerId}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Available Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Available Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No prescriptions available for this customer
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prescription ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-mono">{prescription.id}</TableCell>
                    <TableCell>{getPrescriptionStatusBadge(prescription.status)}</TableCell>
                    <TableCell>{new Date(prescription.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select onValueChange={(productId) => addPrescriptionToOrder(prescription.id, productId)}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Add to order..." />
                        </SelectTrigger>
                        <SelectContent>
                          {prescriptionProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ₹{product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Current Order */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Order</span>
            {orderItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={resetOrder}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Order
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className={`mb-4 ${
              message.type === 'success' ? 'border-green-200 bg-green-50' :
              message.type === 'error' ? 'border-red-200 bg-red-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
               message.type === 'error' ? <XCircle className="h-4 w-4" /> :
               <AlertTriangle className="h-4 w-4" />}
              <AlertDescription className={
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No items in order</p>
              <p className="text-sm">Add prescription items from the table above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Valid Items */}
              {getValidItems().length > 0 && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Valid Items
                  </h4>
                  <div className="space-y-2">
                    {getValidItems().map((item, index) => {
                      const originalIndex = orderItems.findIndex(oi => oi === item);
                      return (
                        <Card key={originalIndex} className="p-3 border-green-200 bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-600">
                                Prescription: {item.prescriptionId} | Unit Price: ₹{item.unitPrice}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(originalIndex, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(originalIndex, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="font-bold">₹{(item.unitPrice * item.quantity).toFixed(2)}</div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeOrderItem(originalIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Invalid Items */}
              {getInvalidItems().length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Invalid Items (Cannot be processed)
                  </h4>
                  <div className="space-y-2">
                    {getInvalidItems().map((item, index) => {
                      const originalIndex = orderItems.findIndex(oi => oi === item);
                      return (
                        <Card key={originalIndex} className="p-3 border-red-200 bg-red-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4 inline mr-1" />
                                {item.errorMessage}
                              </div>
                              <div className="text-sm text-gray-600">
                                Prescription: {item.prescriptionId}
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeOrderItem(originalIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator />

              {/* Order Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Valid Items:</span>
                    <span className="font-medium">{getValidItems().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invalid Items:</span>
                    <span className="font-medium text-red-600">{getInvalidItems().length}</span>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Order Total:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      {orderItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="delivery-address">Delivery Address *</Label>
              <Textarea
                id="delivery-address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter complete delivery address..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={resetOrder}>
                Cancel Order
              </Button>
              <Button 
                onClick={processOrder}
                disabled={isProcessingOrder || getValidItems().length === 0}
                className="min-w-[150px]"
              >
                {isProcessingOrder ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Process Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
