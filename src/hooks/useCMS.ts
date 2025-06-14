
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type CMSPage = Tables<'cms_pages'>;
export type CMSBlogPost = Tables<'cms_blog_posts'>;

export const useCMSPages = () => {
  return useQuery({
    queryKey: ['cms-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CMSPage[];
    },
  });
};

export const useCMSPage = (slug: string) => {
  return useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data as CMSPage;
    },
  });
};

export const useCreateCMSPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: Omit<CMSPage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cms_pages')
        .insert(page)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page created",
        description: "CMS page has been created successfully.",
      });
    },
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as CMSBlogPost[];
    },
  });
};
