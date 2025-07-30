import { IOrderRepository } from '../api/IOrderRepository';
import { Order, OrderItem, CreateOrderData } from '@/com/longchau/pms/domain/Order';
import { ordersData } from '../../data/orders';
import { IProductRepository } from '../api/IProductRepository';

export class FileBasedOrderRepository implements IOrderRepository {
  private orders: Order[] = [...ordersData];
  private orderItems: OrderItem[] = [];
  private nextOrderId = this.orders.length + 1;
  private nextItemId = 1;
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === id);
    return order || null;
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orders.filter(o => o.customerId === customerId);
  }

  async save(orderData: CreateOrderData): Promise<Order> {
    const newOrder: Order = {
      id: this.nextOrderId.toString(),
      customerId: orderData.customerId,
      totalAmount: orderData.totalAmount,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: null,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    this.nextOrderId++;

    // Create order items
    for (const itemData of orderData.items) {
      const orderItem: OrderItem = {
        id: this.nextItemId.toString(),
        orderId: newOrder.id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice,
        totalPrice: itemData.totalPrice
      };
      this.orderItems.push(orderItem);
      this.nextItemId++;
    }

    return newOrder;
  }

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
  }

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderItems.filter(item => item.orderId === orderId);
  }

  async completeOrder(orderId: string): Promise<void> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    // Update order status
    order.status = 'completed';
    order.updatedAt = new Date().toISOString();

    // Decrement stock for all items in the order
    const items = await this.getOrderItems(orderId);
    for (const item of items) {
      await this.productRepository.decrementStock(item.productId, item.quantity);
    }
  }
}
