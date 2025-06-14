
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Prescription = Tables<'prescriptions'>;

// Create a type for new prescriptions that makes reviewed_at optional
export type NewPrescription = Omit<Prescription, 'id' | 'uploaded_at' | 'reviewed_at'> & {
  reviewed_at?: string | null;
};

export const usePrescriptions = () => {
  return useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as Prescription[];
    },
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prescription: NewPrescription) => {
      // First ensure user profile exists
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Unknown User',
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          throw new Error('Failed to create user profile');
        }
      }

      // Now create the prescription
      const { data, error } = await supabase
        .from('prescriptions')
        .insert(prescription)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Prescription uploaded successfully",
        description: "Your prescription has been submitted for review.",
      });
    },
    onError: (error) => {
      console.error('Prescription upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Prescription> }) => {
      const { data, error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Prescription updated",
        description: "Prescription status has been updated.",
      });
    },
  });
};
