
-- Create categories table for product organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color_class TEXT DEFAULT 'bg-blue-100 text-blue-700',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  company TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Out of Stock')),
  prescription_required BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table for user management
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  prescription_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  pharmacist_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to categories and products
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);

-- Create policies for customers (authenticated users only)
CREATE POLICY "Users can view their own customer data" ON public.customers FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert their own customer data" ON public.customers FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own customer data" ON public.customers FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can insert their own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Create policies for order_items
CREATE POLICY "Users can view order items for their orders" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND auth.uid()::text = customer_id::text)
);
CREATE POLICY "Users can insert order items for their orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND auth.uid()::text = customer_id::text)
);

-- Insert sample categories
INSERT INTO public.categories (name, description, color_class) VALUES
('Baby Care', 'Products for infants and toddlers', 'bg-pink-100 text-pink-700'),
('Medicine', 'Prescription and over-the-counter medications', 'bg-green-100 text-green-700'),
('Women Care', 'Health and wellness products for women', 'bg-purple-100 text-purple-700'),
('Vitamins', 'Nutritional supplements and vitamins', 'bg-orange-100 text-orange-700'),
('Personal Care', 'Personal hygiene and care products', 'bg-blue-100 text-blue-700');

-- Insert sample products
INSERT INTO public.products (name, description, company, price, original_price, category_id, image_url, status, prescription_required, rating, reviews_count, stock_quantity, sku) VALUES
('Paracetamol 500mg', 'Pain relief and fever reduction medication', 'Pharma Corp', 10.99, 12.99, (SELECT id FROM public.categories WHERE name = 'Medicine'), 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Available', false, 4.5, 127, 100, 'PARA-500-001'),
('Vitamin D3 Capsules', 'Essential vitamin D3 supplements for bone health', 'HealthLife', 15.50, null, (SELECT id FROM public.categories WHERE name = 'Vitamins'), 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop', 'Available', false, 4.8, 89, 75, 'VITD3-001'),
('Amoxicillin 250mg', 'Antibiotic for bacterial infections', 'MediCare Ltd', 8.75, null, (SELECT id FROM public.categories WHERE name = 'Medicine'), 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Available', true, 4.2, 56, 50, 'AMOX-250-001'),
('Blood Pressure Monitor', 'Digital blood pressure monitoring device', 'TechMed', 45.00, 55.00, (SELECT id FROM public.categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', 'Available', false, 4.6, 203, 25, 'BPM-001'),
('First Aid Kit', 'Complete first aid emergency kit', 'SafeGuard', 22.99, null, (SELECT id FROM public.categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1603398938530-0ac8c3ab3903?w=400&h=400&fit=crop', 'Out of Stock', false, 4.3, 74, 0, 'FAK-001'),
('Omega-3 Fish Oil', 'Premium fish oil supplements for heart health', 'NutriMax', 18.50, null, (SELECT id FROM public.categories WHERE name = 'Vitamins'), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Available', false, 4.7, 145, 80, 'OMEGA3-001'),
('Baby Formula', 'Nutritious infant formula milk powder', 'BabyNutrition', 35.99, null, (SELECT id FROM public.categories WHERE name = 'Baby Care'), 'https://images.unsplash.com/photo-1587662804882-174d12d5a3ac?w=400&h=400&fit=crop', 'Available', false, 4.4, 92, 60, 'FORMULA-001'),
('Feminine Care Pads', 'Ultra-soft feminine hygiene pads', 'WomenFirst', 12.50, null, (SELECT id FROM public.categories WHERE name = 'Women Care'), 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop', 'Available', false, 4.5, 156, 120, 'FEMCARE-001');
