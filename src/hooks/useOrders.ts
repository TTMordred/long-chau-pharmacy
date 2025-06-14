
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

interface CreateOrderData {
  customer_id: string;
  total_amount: number;
  delivery_address: string;
  notes?: string;
  status?: string;
  payment_status?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, company)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // Create the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customer_id,
          total_amount: orderData.total_amount,
          delivery_address: orderData.delivery_address,
          notes: orderData.notes,
          status: orderData.status || 'pending',
          payment_status: orderData.payment_status || 'pending',
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order created",
        description: "The order has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
