
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import ProductQuickView from '@/components/ProductQuickView';
import ProductComparisonModal from '@/components/ProductComparisonModal';
import CategoryNav from '@/components/CategoryNav';
import DashboardHeader from '@/components/DashboardHeader';
import FeatureSection from '@/components/FeatureSection';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import EnhancedCartSidebar from '@/components/EnhancedCartSidebar';
import { FloatingActions } from '@/components/FloatingActions';
import { PageTransition } from '@/components/ui/page-transition';
import { AuthProvider } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import type { Product } from '@/hooks/useProducts';

const IndexContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  
  const { addToCart } = useCart();

  return (
    <PageTransition variant="fade" duration="fast">
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
        {/* Simplified background with better performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <DashboardHeader 
          cartItemsCount={0}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="relative z-10">
          <div className="container mx-auto px-4 pt-24 pb-8">
            <HeroSection />
            <StatsSection />
            <FeatureSection />
            
            <div className="mt-16">
              <CategoryNav 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            
            <div className="mt-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {activeCategory === 'All Products' ? 'All Products' : activeCategory}
                    </h2>
                    <p className="text-gray-600 mt-1">Discover our premium health and wellness collection</p>
                  </div>
                </div>
              </div>
              
              <ProductGrid 
                onProductClick={setSelectedProduct}
                onQuickView={setQuickViewProduct}
                onAddToCart={(product, quantity) => addToCart({ product, quantity })}
                searchQuery={searchQuery}
                categoryFilter={activeCategory === 'All Products' ? undefined : activeCategory}
              />
            </div>
          </div>
        </main>

        <FloatingActions 
          onCartClick={() => setIsCartOpen(true)}
          onComparisonClick={() => setShowComparison(true)}
        />

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

        {quickViewProduct && (
          <ProductQuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={(product, quantity) => addToCart({ product, quantity })}
          />
        )}

        {showComparison && (
          <ProductComparisonModal
            onClose={() => setShowComparison(false)}
            onAddToCart={(product, quantity) => addToCart({ product, quantity })}
          />
        )}
      </div>
    </PageTransition>
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
