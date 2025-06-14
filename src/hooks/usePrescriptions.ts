
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Prescription = Tables<'prescriptions'>;

export type NewPrescription = Omit<Prescription, 'id' | 'uploaded_at'> & {
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
    // Set a reasonable stale time to reduce unnecessary refetches
    staleTime: 30000, // 30 seconds
  });
};

export const usePrescriptionsByCustomer = (customerId?: string) => {
  return useQuery({
    queryKey: ['prescriptions', 'customer', customerId],
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('customer_id', customerId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!customerId,
    staleTime: 30000, // 30 seconds
  });
};

export const usePrescriptionsByStatus = (status?: string) => {
  return useQuery({
    queryKey: ['prescriptions', 'status', status],
    queryFn: async () => {
      if (!status) throw new Error('Status is required');
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('status', status)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!status,
    staleTime: 30000, // 30 seconds
  });
};

export const usePrescription = (id?: string) => {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: async () => {
      if (!id) throw new Error('Prescription ID is required');
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Prescription;
    },
    enabled: !!id,
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prescription: NewPrescription) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
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
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['prescription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['prescription-stats'] });
      
      // If the status changed, invalidate the status-specific queries
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'status', data.status] });
      }
      
      // If we know the customer_id, invalidate customer-specific queries
      if (data.customer_id) {
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'customer', data.customer_id] });
      }
      
      toast({
        title: "Prescription updated",
        description: "Prescription has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Prescription update error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update prescription. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First get the prescription to know which related queries to invalidate
      const { data: prescription, error: fetchError } = await supabase
        .from('prescriptions')
        .select('customer_id, status, prescription_image_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // If there's an image URL, delete it from storage
      if (prescription?.prescription_image_url) {
        try {
          // Extract the path from the URL (assumes format like .../storage/v1/object/public/bucket/path)
          const url = new URL(prescription.prescription_image_url);
          const pathParts = url.pathname.split('/');
          const storagePath = pathParts.slice(pathParts.indexOf('prescriptions') + 1).join('/');
          
          if (storagePath) {
            await supabase.storage
              .from('prescriptions')
              .remove([storagePath]);
          }
        } catch (error) {
          console.error('Error deleting prescription file:', error);
          // Continue with deleting the record even if file deletion fails
        }
      }
      
      // Delete the prescription record
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return prescription; // Return the prescription data for use in onSuccess
    },
    onSuccess: (prescription) => {
      // Invalidate and refetch all prescription queries
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['prescription-stats'] });
      
      // Invalidate status-specific queries if we know the status
      if (prescription?.status) {
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'status', prescription.status] });
      }
      
      // Invalidate customer-specific queries if we know the customer_id
      if (prescription?.customer_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['prescriptions', 'customer', prescription.customer_id] 
        });
      }
      
      toast({
        title: "Prescription deleted",
        description: "Prescription has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Prescription delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete prescription. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Set up real-time subscription for prescriptions
export const setupPrescriptionSubscription = (queryClient: any) => {
  const channel = supabase
    .channel('prescriptions-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'prescriptions' },
      (payload) => {
        // Invalidate and refetch prescriptions queries when data changes
        queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
        queryClient.invalidateQueries({ queryKey: ['prescription-stats'] });
        
        // For specific record changes, invalidate the specific queries
        if (payload.new && payload.new.id) {
          queryClient.invalidateQueries({ queryKey: ['prescription', payload.new.id] });
        }
        
        if (payload.new && payload.new.customer_id) {
          queryClient.invalidateQueries({ 
            queryKey: ['prescriptions', 'customer', payload.new.customer_id] 
          });
        }
        
        if (payload.new && payload.new.status) {
          queryClient.invalidateQueries({ 
            queryKey: ['prescriptions', 'status', payload.new.status] 
          });
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
