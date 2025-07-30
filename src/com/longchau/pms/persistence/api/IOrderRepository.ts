import { Order, OrderItem, CreateOrderData } from '@/com/longchau/pms/domain/Order';

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  save(orderData: CreateOrderData): Promise<Order>;
  updateStatus(id: string, status: Order['status']): Promise<void>;
  updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<void>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  completeOrder(orderId: string): Promise<void>;
}
