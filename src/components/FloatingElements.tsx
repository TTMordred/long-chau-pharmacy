
import { Heart, Star, Sparkles, Circle } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient orbs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/40 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/30 rounded-full blur-3xl animate-float-slow"></div>
      
      {/* Small floating icons */}
      <div className="absolute top-20 left-20 animate-float">
        <Heart className="w-6 h-6 text-pink-300/60" />
      </div>
      <div className="absolute top-40 right-32 animate-float-delayed">
        <Star className="w-5 h-5 text-yellow-300/60" />
      </div>
      <div className="absolute bottom-32 left-1/3 animate-float-slow">
        <Sparkles className="w-4 h-4 text-blue-300/60" />
      </div>
      <div className="absolute bottom-20 right-20 animate-float">
        <Circle className="w-3 h-3 text-purple-300/60" />
      </div>
      
      {/* Geometric shapes */}
      <div className="absolute top-1/4 left-10 w-8 h-8 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-lg rotate-45 animate-float"></div>
      <div className="absolute top-3/4 right-16 w-6 h-6 bg-gradient-to-br from-green-300/40 to-blue-300/40 rounded-full animate-float-delayed"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-gradient-to-br from-pink-300/40 to-red-300/40 rounded-sm rotate-12 animate-float-slow"></div>
    </div>
  );
};

export default FloatingElements;
