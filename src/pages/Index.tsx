
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import CategoryNav from '@/components/CategoryNav';
import DashboardHeader from '@/components/DashboardHeader';
import ModernHeroSection from '@/components/ModernHeroSection';
import ModernStatsSection from '@/components/ModernStatsSection';
import ModernFeatureSection from '@/components/ModernFeatureSection';
import EnhancedCartSidebar from '@/components/EnhancedCartSidebar';
import FloatingElements from '@/components/FloatingElements';
import { AuthProvider } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import type { Product } from '@/hooks/useProducts';

const IndexContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  
  const { cartItemsCount, addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/40 relative overflow-hidden">
      <FloatingElements />
      
      <DashboardHeader 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="relative z-10">
        <div className="container mx-auto px-4 pt-20 pb-8">
          <ModernHeroSection />
          <ModernStatsSection />
          <ModernFeatureSection />
          
          <div className="mt-20">
            <CategoryNav 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-700 bg-clip-text text-transparent">
                  {activeCategory === 'All Products' ? 'All Products' : activeCategory}
                </h2>
                <p className="text-gray-600 font-medium text-lg">Discover our premium health and wellness collection</p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-semibold">Available 24/7</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-semibold">Fast Delivery</span>
                </div>
              </div>
            </div>
            
            <ProductGrid 
              onProductClick={setSelectedProduct}
              onAddToCart={(product, quantity) => addToCart({ product, quantity })}
              searchQuery={searchQuery}
              categoryFilter={activeCategory === 'All Products' ? undefined : activeCategory}
            />
          </div>
        </div>
      </main>

      <EnhancedCartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, quantity) => addToCart({ product, quantity })}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
