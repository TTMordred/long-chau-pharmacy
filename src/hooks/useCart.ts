
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import type { Product } from '@/hooks/useProducts';

interface CartItem extends Product {
  quantity: number;
  cart_id?: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);

  // Fetch cart items from Supabase for authenticated users
  const { data: dbCartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      return data.map(item => ({
        ...item.products,
        quantity: item.quantity,
        cart_id: item.id
      }));
    },
    enabled: !!user,
  });

  // Add item to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: Product; quantity?: number }) => {
      if (!user) {
        // Handle local cart for non-authenticated users
        setLocalCart(prev => {
          const existingItem = prev.find(item => item.id === product.id);
          if (existingItem) {
            return prev.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { ...product, quantity }];
        });
        return;
      }

      // Handle authenticated user cart in Supabase
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update cart quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, newQuantity }: { productId: string; newQuantity: number }) => {
      if (!user) {
        if (newQuantity === 0) {
          setLocalCart(prev => prev.filter(item => item.id !== productId));
        } else {
          setLocalCart(prev =>
            prev.map(item =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            )
          );
        }
        return;
      }

      if (newQuantity === 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        setLocalCart([]);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user.id] });
      }
    }
  });

  // Merge local cart with DB cart when user logs in
  useEffect(() => {
    if (user && localCart.length > 0) {
      localCart.forEach(item => {
        addToCartMutation.mutate({ product: item, quantity: item.quantity });
      });
      setLocalCart([]);
    }
  }, [user]);

  const cartItems = user ? dbCartItems : localCart;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    cartTotal,
    cartItemsCount,
    isLoading: user ? isLoading : false,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};
