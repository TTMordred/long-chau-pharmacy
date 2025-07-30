import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { OrderPresenter, PrescriptionOrderItem } from '@/com/longchau/pms/ui/presenter/OrderPresenter';
import { FileBasedOrderRepository } from '@/com/longchau/pms/persistence/file/FileBasedOrderRepository';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { FileBasedProductRepository } from '@/com/longchau/pms/persistence/file/FileBasedProductRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';
import { Product } from '@/com/longchau/pms/domain/Product';

interface OrderCreationFrameProps {
  customerId: string;
  validatedPrescriptions: Prescription[];
}

export const OrderCreationFrame: React.FC<OrderCreationFrameProps> = ({
  customerId,
  validatedPrescriptions
}) => {
  const productRepository = new FileBasedProductRepository();
  const [presenter] = useState(() => 
    new OrderPresenter(
      new FileBasedOrderRepository(productRepository),
      new FileBasedPrescriptionRepository(),
      productRepository
    )
  );

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>('');
  const [prescriptionProducts, setPrescriptionProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<PrescriptionOrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stockInfo, setStockInfo] = useState<{ [key: string]: { name: string; stock: number } }>({});

  useEffect(() => {
    loadPrescriptionProducts();
  }, []);

  const loadPrescriptionProducts = async () => {
    try {
      const products = await presenter.getPrescriptionRequiredProducts();
      setPrescriptionProducts(products);
      
      // Load stock information
      const stockData: { [key: string]: { name: string; stock: number } } = {};
      for (const product of products) {
        const stock = await presenter.getProductStock(product.id);
        if (stock) {
          stockData[product.id] = {
            name: stock.productName,
            stock: stock.currentStock
          };
        }
      }
      setStockInfo(stockData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load prescription products' });
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      productId: '',
      quantity: 1,
      unitPrice: 0
    }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof PrescriptionOrderItem, value: string | number) => {
    const updated = orderItems.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          const product = prescriptionProducts.find(p => p.id === value);
          return {
            ...item,
            productId: value as string,
            unitPrice: product?.price || 0
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedPrescriptionId) {
      setMessage({ type: 'error', text: 'Please select a validated prescription' });
      return;
    }

    if (orderItems.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one product' });
      return;
    }

    if (!deliveryAddress.trim()) {
      setMessage({ type: 'error', text: 'Please provide a delivery address' });
      return;
    }

    setIsCreatingOrder(true);
    setMessage(null);

    try {
      const result = await presenter.createOrderFromPrescription(
        selectedPrescriptionId,
        orderItems,
        deliveryAddress,
        customerId,
        additionalNotes
      );

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reset form
        setSelectedPrescriptionId('');
        setOrderItems([]);
        setDeliveryAddress('');
        setAdditionalNotes('');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create order' });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const approvedPrescriptions = validatedPrescriptions.filter(p => p.status === 'approved');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create Order from Validated Prescription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {approvedPrescriptions.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Validated Prescriptions</h3>
              <p className="text-gray-500">
                You need at least one approved prescription to create a prescription-based order.
                Please wait for your prescriptions to be validated by a pharmacist.
              </p>
            </div>
          ) : (
            <>
              {/* Prescription Selection */}
              <div>
                <Label htmlFor="prescription-select">Select Validated Prescription</Label>
                <Select value={selectedPrescriptionId} onValueChange={setSelectedPrescriptionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a validated prescription..." />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedPrescriptions.map((prescription) => (
                      <SelectItem key={prescription.id} value={prescription.id}>
                        Prescription {prescription.id} - Approved {new Date(prescription.reviewedAt!).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Prescription Products</Label>
                  <Button type="button" onClick={addOrderItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </div>

                {orderItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No products added yet. Click "Add Product" to start.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item, index) => (
                      <Card key={index} className="p-3">
                        <div className="grid grid-cols-12 gap-3 items-end">
                          <div className="col-span-5">
                            <Label>Product</Label>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateOrderItem(index, 'productId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product..." />
                              </SelectTrigger>
                              <SelectContent>
                                {prescriptionProducts.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    <div className="flex flex-col">
                                      <span>{product.name}</span>
                                      <span className="text-sm text-gray-500">
                                        ₹{product.price} - Stock: {stockInfo[product.id]?.stock || 0}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Unit Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Total</Label>
                            <p className="text-lg font-semibold">
                              ₹{(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeOrderItem(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {orderItems.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Information */}
              <div>
                <Label htmlFor="delivery-address">Delivery Address</Label>
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
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional-notes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || orderItems.length === 0}
                  className="min-w-[150px]"
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Create Order'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
