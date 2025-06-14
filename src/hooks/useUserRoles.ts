
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type UserRole = Tables<'user_roles'>;

export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      let query = supabase.from('user_roles').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId,
  });
};

export const useHasRole = (role: string) => {
  return useQuery({
    queryKey: ['has-role', role],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: (await supabase.auth.getUser()).data.user?.id,
        _role: role,
      });
      
      if (error) throw error;
      return data as boolean;
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role as any })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast({
        title: "Role assigned",
        description: "User role has been assigned successfully.",
      });
    },
  });
};
