import { IOrderRepository } from '@/com/longchau/pms/persistence/api/IOrderRepository';
import { IPrescriptionRepository } from '@/com/longchau/pms/persistence/api/IPrescriptionRepository';
import { IProductRepository } from '@/com/longchau/pms/persistence/api/IProductRepository';
import { Order, CreateOrderData } from '@/com/longchau/pms/domain/Order';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';
import { Product } from '@/com/longchau/pms/domain/Product';

export interface OrderCreationResult {
  success: boolean;
  message: string;
  order?: Order;
}

export interface PrescriptionOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class OrderPresenter {
  private orderRepository: IOrderRepository;
  private prescriptionRepository: IPrescriptionRepository;
  private productRepository: IProductRepository;

  constructor(
    orderRepo: IOrderRepository,
    prescriptionRepo: IPrescriptionRepository,
    productRepo: IProductRepository
  ) {
    this.orderRepository = orderRepo;
    this.prescriptionRepository = prescriptionRepo;
    this.productRepository = productRepo;
  }

  async createOrderFromPrescription(
    prescriptionId: string,
    items: PrescriptionOrderItem[],
    deliveryAddress: string,
    customerId: string,
    additionalNotes?: string
  ): Promise<OrderCreationResult> {
    try {
      // Validate prescription is approved
      const prescription = await this.prescriptionRepository.findById(prescriptionId);
      if (!prescription) {
        return {
          success: false,
          message: 'Prescription not found'
        };
      }

      if (prescription.status !== 'approved') {
        return {
          success: false,
          message: 'Cannot create order: Prescription is not yet validated/approved'
        };
      }

      // Validate all items are prescription-required products
      const validationResult = await this.validatePrescriptionItems(items);
      if (!validationResult.success) {
        return validationResult;
      }

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      const orderData: CreateOrderData = {
        customerId,
        totalAmount,
        deliveryAddress,
        notes: `Prescription Order - Prescription ID: ${prescriptionId}${additionalNotes ? '\n' + additionalNotes : ''}`,
        status: 'pending',
        paymentStatus: 'pending',
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity
        }))
      };

      const order = await this.orderRepository.save(orderData);

      return {
        success: true,
        message: 'Order created successfully from validated prescription',
        order
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order'
      };
    }
  }

  async completeOrderAndUpdateInventory(orderId: string): Promise<OrderCreationResult> {
    try {
      // Get order details
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        return {
          success: false,
          message: 'Order not found'
        };
      }

      if (order.status === 'completed') {
        return {
          success: false,
          message: 'Order is already completed'
        };
      }

      // Complete the order (this will automatically decrement stock)
      await this.orderRepository.completeOrder(orderId);

      return {
        success: true,
        message: 'Order completed successfully. Inventory has been updated.',
        order: { ...order, status: 'completed' }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to complete order'
      };
    }
  }

  async getPrescriptionRequiredProducts(): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    return allProducts.filter(product => product.prescriptionRequired === true);
  }

  async getProductStock(productId: string): Promise<{ productName: string; currentStock: number } | null> {
    const product = await this.productRepository.findById(productId);
    if (!product) return null;

    return {
      productName: product.name,
      currentStock: product.stockQuantity || 0
    };
  }

  private async validatePrescriptionItems(items: PrescriptionOrderItem[]): Promise<OrderCreationResult> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${item.productId} not found`
        };
      }

      if (!product.prescriptionRequired) {
        return {
          success: false,
          message: `Product "${product.name}" does not require a prescription`
        };
      }

      // Check stock availability
      if (product.stockQuantity !== null && product.stockQuantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        };
      }
    }

    return { success: true, message: 'All items are valid' };
  }
}
