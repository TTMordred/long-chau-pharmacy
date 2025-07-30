import React, { useState, useEffect } from 'react';
import { Package, TrendingDown, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderPresenter } from '@/com/longchau/pms/ui/presenter/OrderPresenter';
import { FileBasedOrderRepository } from '@/com/longchau/pms/persistence/file/FileBasedOrderRepository';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { FileBasedProductRepository } from '@/com/longchau/pms/persistence/file/FileBasedProductRepository';
import { Product } from '@/com/longchau/pms/domain/Product';
import { Order } from '@/com/longchau/pms/domain/Order';

export const InventoryManagementFrame: React.FC = () => {
  const productRepository = new FileBasedProductRepository();
  const [presenter] = useState(() => 
    new OrderPresenter(
      new FileBasedOrderRepository(productRepository),
      new FileBasedPrescriptionRepository(),
      productRepository
    )
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stockHistory, setStockHistory] = useState<{ 
    productId: string; 
    productName: string; 
    beforeStock: number; 
    afterStock: number; 
    orderId: string; 
    timestamp: string;
  }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load prescription products
      const prescriptionProducts = await presenter.getPrescriptionRequiredProducts();
      setProducts(prescriptionProducts);

      // For demo purposes, we'll create some mock orders
      // In a real application, this would come from the order repository
      const mockOrders: Order[] = [
        {
          id: "order-1",
          customerId: "user-1",
          totalAmount: 47.50,
          status: "pending",
          paymentStatus: "paid",
          paymentMethod: "credit_card",
          deliveryAddress: "123 Main St, City, State",
          notes: "Prescription Order - Prescription ID: 2",
          createdAt: "2024-12-01T10:00:00Z",
          updatedAt: "2024-12-01T10:00:00Z"
        },
        {
          id: "order-2",
          customerId: "user-2",
          totalAmount: 57.00,
          status: "processing",
          paymentStatus: "paid",
          paymentMethod: "debit_card",
          deliveryAddress: "456 Oak Ave, City, State",
          notes: "Prescription Order - Prescription ID: 1",
          createdAt: "2024-12-01T11:30:00Z",
          updatedAt: "2024-12-01T11:30:00Z"
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrderId) {
      setMessage({ type: 'error', text: 'Please select an order to complete' });
      return;
    }

    setIsProcessingOrder(true);
    setMessage(null);

    try {
      // Capture stock levels before completion
      const stockBefore: { [key: string]: number } = {};
      for (const product of products) {
        stockBefore[product.id] = product.stockQuantity || 0;
      }

      const result = await presenter.completeOrderAndUpdateInventory(selectedOrderId);

      if (result.success) {
        // Update the orders state
        setOrders(orders.map(order => 
          order.id === selectedOrderId 
            ? { ...order, status: 'completed' as const }
            : order
        ));

        // Reload products to get updated stock levels
        const updatedProducts = await presenter.getPrescriptionRequiredProducts();
        setProducts(updatedProducts);

        // Record stock changes for demonstration
        const newStockHistory = [];
        for (const product of updatedProducts) {
          const beforeStock = stockBefore[product.id];
          const afterStock = product.stockQuantity || 0;
          
          if (beforeStock !== afterStock) {
            newStockHistory.push({
              productId: product.id,
              productName: product.name,
              beforeStock,
              afterStock,
              orderId: selectedOrderId,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        setStockHistory([...newStockHistory, ...stockHistory]);
        setSelectedOrderId('');
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to complete order' });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 20) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const pendingOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Order Completion Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Complete Order & Update Inventory
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

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Order to Complete</label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order to complete..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      Order {order.id} - ₹{order.totalAmount} ({order.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleCompleteOrder} 
              disabled={!selectedOrderId || isProcessingOrder}
            >
              {isProcessingOrder ? 'Processing...' : 'Complete Order'}
            </Button>
          </div>

          {pendingOrders.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No pending orders to complete
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Current Prescription Medication Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stockQuantity || 0);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="text-lg font-semibold">
                      {product.stockQuantity || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Change History */}
      {stockHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Recent Stock Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Before</TableHead>
                  <TableHead>After</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistory.map((change, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{change.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{change.orderId}</TableCell>
                    <TableCell>{change.beforeStock}</TableCell>
                    <TableCell>{change.afterStock}</TableCell>
                    <TableCell className="text-red-600 font-semibold">
                      -{change.beforeStock - change.afterStock}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(change.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
