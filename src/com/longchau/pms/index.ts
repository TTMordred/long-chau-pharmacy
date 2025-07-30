// PMS (Pharmacy Management System) Architecture Implementation
// University Assignment - MVP Pattern with Repository Pattern

// Domain Models (Model Layer)
export { type Product, type Category } from './domain/Product';
export { type Prescription, type NewPrescription } from './domain/Prescription';
export { type Order, type OrderItem, type CreateOrderData, type CreateOrderItemData } from './domain/Order';

// Repository Interfaces (Data Access Abstraction)
export { type IProductRepository } from './persistence/api/IProductRepository';
export { type IPrescriptionRepository } from './persistence/api/IPrescriptionRepository';
export { type IOrderRepository } from './persistence/api/IOrderRepository';

// Repository Implementations (File-based Persistence)
export { FileBasedProductRepository } from './persistence/file/FileBasedProductRepository';
export { FileBasedPrescriptionRepository } from './persistence/file/FileBasedPrescriptionRepository';
export { FileBasedOrderRepository } from './persistence/file/FileBasedOrderRepository';

// Presenters (Business Logic Layer)
export { PrescriptionUploadPresenter } from './ui/presenter/PrescriptionUploadPresenter';
export { PrescriptionValidationPresenter } from './ui/presenter/PrescriptionValidationPresenter';
export { OrderPresenter } from './ui/presenter/OrderPresenter';

// Views (React Components)
export { PrescriptionUploadFrame } from './ui/view/PrescriptionUploadFrame';
export { PrescriptionValidationFrame } from './ui/view/PrescriptionValidationFrame';
export { OrderCreationFrame } from './ui/view/OrderCreationFrame';
export { InventoryManagementFrame } from './ui/view/InventoryManagementFrame';

// Main Application
export { PMSApp } from './main/PMSApp';

// Data Files
export { productsData } from './data/products';
export { prescriptionsData } from './data/prescriptions';
export { ordersData } from './data/orders';

/**
 * PMS Architecture Overview:
 * 
 * This implementation demonstrates:
 * 1. MVP (Model-View-Presenter) Pattern
 * 2. Repository Pattern for data access
 * 3. Vertical slice architecture
 * 4. File-based persistence simulation
 * 
 * Vertical Slice Features:
 * - Task 3: Digital Prescription Submission
 * - Task 5: Pharmacist Prescription Validation
 * - Task 4: Order Placement with Prescription
 * - Task 7: Real-time Inventory Management
 * 
 * Access the demo at: /pms-demo
 */
