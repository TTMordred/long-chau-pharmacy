
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import CategoryNav from '@/components/CategoryNav';
import DashboardHeader from '@/components/DashboardHeader';
import FeatureSection from '@/components/FeatureSection';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import EnhancedCartSidebar from '@/components/EnhancedCartSidebar';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { PageTransition } from '@/components/ui/page-transition';
import { GlassCard } from '@/components/ui/glass-card';
import { AuthProvider } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { ShoppingCart, Heart, Search, Plus } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';

const IndexContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [showSearch, setShowSearch] = useState(false);
  
  const { cartItemsCount, addToCart } = useCart();

  return (
    <PageTransition variant="fade" duration="normal">
      <div className="min-h-screen bg-gradient-to-br from-sage via-mint to-blue/20 relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main gradient orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue/30 to-mint/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-sage/40 to-blue/30 rounded-full blur-3xl animate-pulse delay-1000 opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-mint/20 to-sage/30 rounded-full blur-3xl animate-pulse delay-2000 opacity-60"></div>
          
          {/* Floating decorative elements with enhanced animations */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-blue rounded-full animate-[float_6s_ease-in-out_infinite] opacity-60"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-sage rounded-full animate-[float_8s_ease-in-out_infinite] delay-1000 opacity-50"></div>
          <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-mint rounded-full animate-[float_7s_ease-in-out_infinite] delay-2000 opacity-70"></div>
          <div className="absolute bottom-20 right-20 w-5 h-5 bg-navy/40 rounded-full animate-[float_9s_ease-in-out_infinite] delay-3000 opacity-60"></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue/60 rounded-full animate-[float_5s_ease-in-out_infinite] delay-500 opacity-40"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-sage/60 rounded-full animate-[float_10s_ease-in-out_infinite] delay-1500 opacity-50"></div>
        </div>

        <DashboardHeader 
          cartItemsCount={cartItemsCount}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="relative z-10">
          <div className="container mx-auto px-4 pt-24 pb-8">
            <HeroSection />
            <StatsSection />
            
            {/* Enhanced Feature Section with Glass Cards */}
            <div className="my-16">
              <FeatureSection />
            </div>
            
            <div className="mt-16">
              <CategoryNav 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            
            <div className="mt-12 space-y-8">
              <GlassCard variant="tinted" hover="glow" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-navy">
                      {activeCategory === 'All Products' ? 'All Products' : activeCategory}
                    </h2>
                    <p className="text-navy/70 font-medium">Discover our premium health and wellness collection</p>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-mint/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
                      <span className="text-navy font-medium">Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-mint/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="w-2 h-2 bg-blue rounded-full animate-pulse"></div>
                      <span className="text-navy font-medium">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <ProductGrid 
                onProductClick={setSelectedProduct}
                onAddToCart={(product, quantity) => addToCart({ product, quantity })}
                searchQuery={searchQuery}
                categoryFilter={activeCategory === 'All Products' ? undefined : activeCategory}
              />
            </div>
          </div>
        </main>

        {/* Floating Action Buttons */}
        <FloatingActionButton
          onClick={() => setIsCartOpen(true)}
          position="bottom-right"
          variant="default"
          animation="scale"
          className="shadow-xl hover:shadow-2xl"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </div>
        </FloatingActionButton>

        <FloatingActionButton
          onClick={() => setShowSearch(!showSearch)}
          position="bottom-left"
          variant="secondary"
          animation="float"
          className="shadow-xl hover:shadow-2xl"
        >
          <Search className="h-6 w-6" />
        </FloatingActionButton>

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
