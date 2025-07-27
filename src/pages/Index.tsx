
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import CategoryNav from '@/components/CategoryNav';
import DashboardHeader from '@/components/DashboardHeader';
import FeatureSection from '@/components/FeatureSection';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import HealthPostsSection from '@/components/HealthPostsSection';
import BlogPostsSection from '@/components/BlogPostsSection';
import EnhancedCartSidebar from '@/components/EnhancedCartSidebar';
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
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-mint/3 to-blue/8 relative overflow-hidden">
      {/* Enhanced friendly animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-blue/20 to-mint/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-sage/30 to-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-mint/15 to-sage/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Enhanced floating decorative elements */}
        <div className="absolute top-24 left-24 w-6 h-6 bg-blue/60 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-48 right-40 w-8 h-8 bg-sage/70 rounded-full animate-pulse delay-500 opacity-60"></div>
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-mint/80 rounded-full animate-pulse delay-1000 opacity-80"></div>
        <div className="absolute bottom-24 right-24 w-7 h-7 bg-navy/50 rounded-full animate-pulse delay-1500 opacity-70"></div>
        <div className="absolute top-1/3 left-16 w-4 h-4 bg-coral/60 rounded-full animate-pulse delay-2000 opacity-60"></div>
      </div>

      <DashboardHeader 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="relative z-10">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <HeroSection />
          <StatsSection />
          <FeatureSection />
          
          {/* Health Posts Section */}
          <div className="mt-16">
            <HealthPostsSection />
          </div>
          
          {/* Blog Posts Section */}
          <div className="mt-8">
            <BlogPostsSection />
          </div>
          
          <div className="mt-16">
            <CategoryNav 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          <div className="mt-12 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-navy">
                  {activeCategory === 'All Products' ? 'All Products' : activeCategory}
                </h2>
                <p className="text-navy/70 font-medium">Discover our premium health and wellness collection</p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-mint/40 shadow-sm">
                  <div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
                  <span className="text-navy font-medium">Available 24/7</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-mint/40 shadow-sm">
                  <div className="w-2 h-2 bg-blue rounded-full animate-pulse"></div>
                  <span className="text-navy font-medium">Fast Delivery</span>
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
