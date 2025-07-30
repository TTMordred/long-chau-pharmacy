import { Product } from '@/com/longchau/pms/domain/Product';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findBySearch(searchQuery?: string, categoryFilter?: string): Promise<Product[]>;
  save(product: Product): Promise<void>;
  checkStock(sku: string, quantity: number): Promise<boolean>;
  updateStock(sku: string, newQuantity: number): Promise<void>;
  decrementStock(productId: string, quantity: number): Promise<void>;
}
