
import React from 'react';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useProductComparison } from '@/hooks/useProductComparison';
import { ShoppingCart, Heart, GitCompare } from 'lucide-react';

interface FloatingActionsProps {
  onCartClick: () => void;
  onComparisonClick: () => void;
}

export const FloatingActions = ({ onCartClick, onComparisonClick }: FloatingActionsProps) => {
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { comparisonCount } = useProductComparison();

  return (
    <>
      {/* Cart Button */}
      <FloatingActionButton
        onClick={onCartClick}
        position="bottom-right"
        variant="default"
        className="bg-white shadow-lg hover:shadow-xl border border-gray-200"
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </div>
      </FloatingActionButton>

      {/* Wishlist Button */}
      {wishlistCount > 0 && (
        <div className="fixed bottom-6 left-6 z-50">
          <FloatingActionButton
            onClick={() => {/* TODO: Open wishlist */}}
            variant="outline"
            className="bg-white shadow-lg hover:shadow-xl border border-gray-200"
          >
            <div className="relative">
              <Heart className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            </div>
          </FloatingActionButton>
        </div>
      )}

      {/* Comparison Button */}
      {comparisonCount > 0 && (
        <div className="fixed bottom-20 left-6 z-50">
          <FloatingActionButton
            onClick={onComparisonClick}
            variant="outline"
            className="bg-white shadow-lg hover:shadow-xl border border-gray-200"
          >
            <div className="relative">
              <GitCompare className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonCount}
              </span>
            </div>
          </FloatingActionButton>
        </div>
      )}
    </>
  );
};
