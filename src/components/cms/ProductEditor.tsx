
import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUploadCMSMedia } from '@/hooks/useCMSContent';
import { toast } from '@/components/ui/use-toast';
import type { Product, Category } from '@/hooks/useProducts';

interface ProductEditorProps {
  initialData?: Product | null;
  categories: Category[];
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductEditor = ({ initialData, categories, onSave, onCancel }: ProductEditorProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    original_price: initialData?.original_price?.toString() || '',
    category_id: initialData?.category_id || '',
    stock_quantity: initialData?.stock_quantity?.toString() || '',
    status: initialData?.status || 'Available',
    prescription_required: initialData?.prescription_required || false,
    image_url: initialData?.image_url || '',
    sku: initialData?.sku || '',
  });

  const uploadMedia = useUploadCMSMedia();
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadMedia.mutateAsync({ 
        file, 
        path: 'products' 
      });
      handleInputChange('image_url', imageUrl);
      toast({
        title: "Image uploaded",
        description: "Product image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    handleInputChange('image_url', '');
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.company.trim() || !formData.price.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (name, company, price).",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    const originalPrice = formData.original_price ? parseFloat(formData.original_price) : null;
    const stockQuantity = formData.stock_quantity ? parseInt(formData.stock_quantity) : 0;

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const productData: Partial<Product> = {
      name: formData.name.trim(),
      company: formData.company.trim(),
      description: formData.description.trim() || null,
      price,
      original_price: originalPrice,
      category_id: formData.category_id || null,
      stock_quantity: stockQuantity,
      status: formData.status,
      prescription_required: formData.prescription_required,
      image_url: formData.image_url || null,
      sku: formData.sku.trim() || null,
    };

    onSave(productData);
  };

  const generateSKU = () => {
    const prefix = formData.company.substring(0, 3).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    handleInputChange('sku', `${prefix}-${suffix}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>
              {initialData ? 'Edit Product' : 'Create New Product'}
            </CardTitle>
            <CardDescription>
              {initialData ? 'Update product information' : 'Add a new product to your pharmacy inventory'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price (₹)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => handleInputChange('original_price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    <SelectItem value="Discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <div className="flex gap-2">
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Product SKU"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSKU}
                  disabled={!formData.company}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="prescription"
                checked={formData.prescription_required}
                onCheckedChange={(checked) => handleInputChange('prescription_required', checked)}
              />
              <Label htmlFor="prescription">Prescription Required</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Product Image</Label>
          <div className="mt-2">
            {formData.image_url ? (
              <div className="relative inline-block">
                <img
                  src={formData.image_url}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload a product image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {isUploading ? 'Uploading...' : 'Choose Image'}
                </Label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductEditor;
