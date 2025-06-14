
-- Create CMS content management tables
CREATE TABLE public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create CMS blog posts table
CREATE TABLE public.cms_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create user roles enum and table
CREATE TYPE public.user_role AS ENUM ('customer', 'pharmacist', 'admin', 'content_manager');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-media', 'cms-media', true) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update existing prescriptions table policies
DROP POLICY IF EXISTS "Users can view their own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can insert their own prescriptions" ON public.prescriptions;

CREATE POLICY "Users can view their own prescriptions" ON public.prescriptions 
FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own prescriptions" ON public.prescriptions 
FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Pharmacists and admins can view all prescriptions" ON public.prescriptions 
FOR SELECT USING (
  public.has_role(auth.uid(), 'pharmacist') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Pharmacists and admins can update prescriptions" ON public.prescriptions 
FOR UPDATE USING (
  public.has_role(auth.uid(), 'pharmacist') OR 
  public.has_role(auth.uid(), 'admin')
);

-- CMS policies
CREATE POLICY "Everyone can view published pages" ON public.cms_pages 
FOR SELECT USING (status = 'published');

CREATE POLICY "Content managers and admins can manage pages" ON public.cms_pages 
FOR ALL USING (
  public.has_role(auth.uid(), 'content_manager') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Everyone can view published blog posts" ON public.cms_blog_posts 
FOR SELECT USING (status = 'published');

CREATE POLICY "Content managers and admins can manage blog posts" ON public.cms_blog_posts 
FOR ALL USING (
  public.has_role(auth.uid(), 'content_manager') OR 
  public.has_role(auth.uid(), 'admin')
);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for prescriptions
CREATE POLICY "Users can upload their own prescriptions" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'prescriptions' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own prescriptions" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'prescriptions' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Pharmacists can view all prescriptions" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'prescriptions' AND 
  (public.has_role(auth.uid(), 'pharmacist') OR public.has_role(auth.uid(), 'admin'))
);

-- Storage policies for CMS media
CREATE POLICY "Content managers can upload CMS media" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'cms-media' AND 
  (public.has_role(auth.uid(), 'content_manager') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Everyone can view CMS media" ON storage.objects 
FOR SELECT USING (bucket_id = 'cms-media');
