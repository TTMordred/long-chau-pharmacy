
import { ArrowRight, Shield, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative py-16 lg:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 animate-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full text-sm font-medium text-blue-700 border border-blue-200/50 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Licensed & Verified Pharmacy
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Your Health,
              </span>
              <br />
              <span className="text-gray-900">Our Priority</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Experience the future of pharmacy with our AI-powered platform. Get your medications delivered fast, safe, and secure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 bg-white/60 backdrop-blur-sm border-2 border-white/50 hover:bg-white/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Upload Prescription
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">50K+ Happy Customers</span>
            </div>
          </div>
        </div>

        {/* Visual Element */}
        <div className="relative animate-in slide-in-from-right duration-1000 delay-300">
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative z-10 bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300"></div>
                  <div className="h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg transform -rotate-2 hover:-rotate-3 transition-transform duration-300"></div>
                </div>
                <div className="space-y-4 pt-6">
                  <div className="h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg transform rotate-1 hover:rotate-2 transition-transform duration-300"></div>
                  <div className="h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg transform -rotate-1 hover:-rotate-2 transition-transform duration-300"></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce delay-1000"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-40 animate-pulse delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
