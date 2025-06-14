
import { ArrowRight, Sparkles, Heart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModernHeroSection = () => {
  return (
    <div className="relative py-20 text-center space-y-12 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl rotate-12 animate-float"></div>
      </div>
      <div className="absolute top-20 right-16 opacity-30">
        <Heart className="w-12 h-12 text-pink-400 animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-25">
        <Shield className="w-16 h-16 text-green-400 animate-bounce" />
      </div>
      <div className="absolute bottom-32 right-20 opacity-20">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-8 animate-fade-in">
        {/* Premium badge */}
        <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <Sparkles className="w-5 h-5 text-blue-500 mr-3 animate-spin-slow" />
          <span className="text-gray-800 font-bold text-base">Welcome to Premium Healthcare</span>
          <Zap className="w-4 h-4 text-yellow-500 ml-3 animate-pulse" />
        </div>
        
        {/* Main heading with gradient */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Health Made
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-reverse">
              Beautiful
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
            <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
          Experience the future of healthcare with our premium products, 
          <br className="hidden md:block" />
          seamless ordering, and lightning-fast delivery.
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 group text-lg font-semibold"
          >
            <span className="mr-3">Start Shopping</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 text-lg font-semibold"
          >
            Learn More
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 pt-12 text-sm">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">50,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">Licensed Pharmacists</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">Same-Day Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
