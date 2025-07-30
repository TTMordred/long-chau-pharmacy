import { IProductRepository } from '../api/IProductRepository';
import { Product } from '@/com/longchau/pms/domain/Product';
import { productsData } from '../../data/products';

export class FileBasedProductRepository implements IProductRepository {
  private products: Product[] = [...productsData];

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findBySearch(searchQuery?: string, categoryFilter?: string): Promise<Product[]> {
    let filteredProducts = [...this.products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.company.toLowerCase().includes(query)
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.categoryId === categoryFilter
      );
    }

    return filteredProducts;
  }

  async save(product: Product): Promise<void> {
    const existingIndex = this.products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      this.products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
  }

  async checkStock(sku: string, quantity: number): Promise<boolean> {
    const product = this.products.find(p => p.sku === sku);
    return product ? (product.stockQuantity || 0) >= quantity : false;
  }

  async updateStock(sku: string, newQuantity: number): Promise<void> {
    const product = this.products.find(p => p.sku === sku);
    if (product) {
      product.stockQuantity = newQuantity;
      product.updatedAt = new Date().toISOString();
    }
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    const product = this.products.find(p => p.id === productId);
    if (product && product.stockQuantity !== null) {
      product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
      product.updatedAt = new Date().toISOString();
    }
  }
}
