export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  company: string;
  categoryId: string | null;
  imageUrl: string | null;
  sku: string | null;
  stockQuantity: number | null;
  prescriptionRequired: boolean | null;
  rating: number | null;
  reviewsCount: number | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
