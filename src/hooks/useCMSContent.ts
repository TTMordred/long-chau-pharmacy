import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CMSPage, CMSBlogPost } from '@/hooks/useCMS';
import type { Product } from '@/hooks/useProducts';

// Create types that exclude fields handled by the backend
type CreatePageInput = Omit<CMSPage, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'published_at'> & {
  published_at?: string | null;
};

type CreateBlogPostInput = Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'published_at'> & {
  published_at?: string | null;
};

// Pages
export const usePages = () => {
  return useQuery({
    queryKey: ['cms-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as CMSPage[];
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as CMSPage | null;
    },
    enabled: !!slug,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: CreatePageInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const pageData = {
        ...page,
        author_id: user.id,
        published_at: page.status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('cms_pages')
        .insert(pageData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page created",
        description: "The page has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CMSPage> }) => {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Set published_at if status is being changed to published and it's not already set
      if (updates.status === 'published' && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('cms_pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      queryClient.invalidateQueries({ queryKey: ['cms-page', variables.id] });
      toast({
        title: "Page updated",
        description: "The page has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page deleted",
        description: "The page has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Blog Posts
export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['cms-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as CMSBlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['cms-blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as CMSBlogPost | null;
    },
    enabled: !!slug,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: CreateBlogPostInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const postData = {
        ...post,
        author_id: user.id,
        published_at: post.status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('cms_blog_posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      toast({
        title: "Blog post created",
        description: "The blog post has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CMSBlogPost> }) => {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Set published_at if status is being changed to published and it's not already set
      if (updates.status === 'published' && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('cms_blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['cms-blog-post', variables.id] });
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Products Management
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Upload CMS Media
export const useUploadCMSMedia = () => {
  return useMutation({
    mutationFn: async ({ file, path }: { file: File, path?: string }) => {
      const filePath = path ? 
        `${path}/${Date.now()}_${file.name}` : 
        `${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('cms-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('cms-content')
        .getPublicUrl(data.path);
      
      return publicUrl;
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Delete CMS Media
export const useDeleteCMSMedia = () => {
  return useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage
        .from('cms-content')
        .remove([path]);
      
      if (error) throw error;
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
