import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, Package, ArrowUpDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useCMSContent';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import ProductEditor from './ProductEditor';
import type { Product } from '@/hooks/useProducts';

// Define the proper input type for creating products
type ProductInput = {
  name: string;
  company: string;
  price: number;
  description?: string | null;
  original_price?: number | null;
  category_id?: string | null;
  stock_quantity?: number;
  status?: string;
  prescription_required?: boolean;
  image_url?: string | null;
  sku?: string | null;
};

const ProductsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: products, isLoading, error, refetch } = useProducts(searchQuery, categoryFilter);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  // Auto-refresh data when mutations complete
  useEffect(() => {
    if (createProduct.isSuccess || updateProduct.isSuccess || deleteProduct.isSuccess) {
      refetch();
    }
  }, [createProduct.isSuccess, updateProduct.isSuccess, deleteProduct.isSuccess, refetch]);

  const handleCreateProduct = async (productData: ProductInput) => {
    try {
      await createProduct.mutateAsync(productData);
      setIsCreating(false);
      // The useEffect above will handle the refetch
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdateProduct = async (productData: ProductInput) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        updates: productData,
      });
      setEditingProduct(null);
      // The useEffect above will handle the refetch
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      setIsConfirmingDelete(null);
      // The useEffect above will handle the refetch
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    // Ensure the product still exists before editing
    const productExists = products?.find(p => p.id === product.id);
    if (!productExists) {
      toast({
        title: "Product not found",
        description: "This product may have been deleted. Refreshing the list.",
        variant: "destructive",
      });
      refetch();
      return;
    }
    setEditingProduct(product);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'Out of Stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'Discontinued':
        return <Badge variant="outline" className="text-gray-500">Discontinued</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPrescriptionBadge = (prescriptionRequired: boolean) => {
    return prescriptionRequired ? (
      <Badge variant="outline" className="text-orange-600 border-orange-300">
        Prescription Required
      </Badge>
    ) : (
      <Badge variant="outline" className="text-green-600 border-green-300">
        Over the Counter
      </Badge>
    );
  };

  const filteredProducts = products?.filter(product => {
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesStatus;
  }) || [];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
          <CardDescription>Error loading products</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load products: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCreating) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <ProductEditor
            categories={categories || []}
            onSave={handleCreateProduct}
            onCancel={() => setIsCreating(false)}
          />
        </CardContent>
      </Card>
    );
  }

  if (editingProduct) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <ProductEditor
            initialData={editingProduct}
            categories={categories || []}
            onSave={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Products Management</CardTitle>
            <CardDescription>Manage pharmacy products and inventory</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
              <p className="text-muted-foreground">
                No products match your current filters. Try adjusting your search.
              </p>
            ) : (
              <p className="text-muted-foreground mt-2 mb-6">
                Get started by adding your first product to the pharmacy inventory.
              </p>
            )}
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center">
                      Product
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {categories?.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock_quantity || 0}</TableCell>
                    <TableCell>{getStatusBadge(product.status || 'Available')}</TableCell>
                    <TableCell>{getPrescriptionBadge(product.prescription_required || false)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Product Preview",
                              description: `Preview for ${product.name}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={isConfirmingDelete === product.id}
                          onOpenChange={(open) => {
                            if (!open) setIsConfirmingDelete(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsConfirmingDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Product</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the product "{product.name}"?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsConfirmingDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deleteProduct.isPending}
                              >
                                {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsManagement;
