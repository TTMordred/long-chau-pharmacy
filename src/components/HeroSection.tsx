
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative py-16 text-center space-y-8">
      {/* Friendly floating icons */}
      <div className="absolute top-8 left-8 opacity-30">
        <Heart className="w-8 h-8 text-sage animate-pulse" />
      </div>
      <div className="absolute top-12 right-12 opacity-40">
        <Sparkles className="w-6 h-6 text-blue animate-pulse delay-500" />
      </div>
      
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
        {/* Friendly badge */}
        <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-mint/50 shadow-lg">
          <Sparkles className="w-4 h-4 text-blue mr-2" />
          <span className="text-navy font-semibold text-sm">Welcome to Your Health Journey</span>
        </div>
        
        {/* Main heading with friendly tone */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="gradient-text">Your Health,</span>
          <br />
          <span className="text-navy">Our Priority</span>
          <br />
          <span className="text-blue">Made Simple</span>
        </h1>
        
        {/* Friendly subheading */}
        <p className="text-lg md:text-xl text-navy/70 max-w-3xl mx-auto leading-relaxed font-medium">
          Experience healthcare that cares about you. From prescription uploads to doorstep delivery, 
          we're here to make your wellness journey as smooth and friendly as possible.
        </p>
        
        {/* Call-to-action buttons with friendly styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button 
            size="lg" 
            className="bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <span className="mr-2">Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-blue text-blue hover:bg-blue hover:text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Learn More
          </Button>
        </div>
        
        {/* Trust indicators with friendly messaging */}
        <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm">
          <div className="flex items-center gap-2 text-navy/60 font-medium">
            <div className="w-2 h-2 bg-sage rounded-full"></div>
            <span>Trusted by 50,000+ families</span>
          </div>
          <div className="flex items-center gap-2 text-navy/60 font-medium">
            <div className="w-2 h-2 bg-blue rounded-full"></div>
            <span>Licensed pharmacists</span>
          </div>
          <div className="flex items-center gap-2 text-navy/60 font-medium">
            <div className="w-2 h-2 bg-mint rounded-full"></div>
            <span>Same-day delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
