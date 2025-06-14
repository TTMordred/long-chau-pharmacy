
import { useState } from 'react';
import { ArrowRight, Package, Plus, Minus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/components/ui/use-toast';
import type { Prescription } from '@/hooks/usePrescriptions';
import type { Product } from '@/hooks/useProducts';

interface PrescriptionItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface PrescriptionToProductConverterProps {
  prescription: Prescription;
  onOrderCreated: () => void;
  onCancel: () => void;
}

const PrescriptionToProductConverter = ({ 
  prescription, 
  onOrderCreated, 
  onCancel 
}: PrescriptionToProductConverterProps) => {
  const { data: products = [] } = useProducts();
  const createOrder = useCreateOrder();
  
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const prescriptionProducts = products.filter(product => product.prescription_required);

  const addItem = () => {
    setPrescriptionItems(prev => [
      ...prev,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        price: 0,
      }
    ]);
  };

  const removeItem = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PrescriptionItem, value: string | number) => {
    setPrescriptionItems(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'product_id') {
          const selectedProduct = prescriptionProducts.find(p => p.id === value);
          return {
            ...item,
            product_id: value as string,
            product_name: selectedProduct?.name || '',
            price: selectedProduct?.price || 0,
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return prescriptionItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (prescriptionItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one product to create an order.",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Please provide a delivery address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        customer_id: prescription.customer_id,
        total_amount: calculateTotal(),
        delivery_address: deliveryAddress,
        notes: `Prescription Order - Prescription ID: ${prescription.id}\n${notes}`,
        status: 'pending',
        payment_status: 'pending',
        items: prescriptionItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        })),
      };

      await createOrder.mutateAsync(orderData);
      onOrderCreated();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Convert Prescription to Order
        </CardTitle>
        <CardDescription>
          Create an order based on the approved prescription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Prescription Details</h4>
          <p className="text-sm text-gray-600">
            Prescription ID: {prescription.id}
          </p>
          <p className="text-sm text-gray-600">
            Status: <Badge className="bg-green-500">Approved</Badge>
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Prescription Items</Label>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {prescriptionItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <Label>Product</Label>
                    <Select
                      value={item.product_id}
                      onValueChange={(value) => updateItem(index, 'product_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {prescriptionProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ₹{product.price}
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
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="text-lg font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {prescriptionItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items added. Click "Add Item" to start.
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="delivery-address">Delivery Address *</Label>
          <Input
            id="delivery-address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter delivery address"
          />
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions"
          />
        </div>

        {prescriptionItems.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrder} disabled={prescriptionItems.length === 0}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionToProductConverter;
