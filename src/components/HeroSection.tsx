
import { ArrowRight, Sparkles, Heart, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="relative py-24 text-center space-y-16 overflow-hidden">
      {/* Enhanced floating background elements with glass morphism */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-ocean/25 to-seafoam/35 rounded-full blur-2xl animate-float shadow-2xl"></div>
        <div className="absolute top-20 right-16 w-16 h-16 bg-gradient-to-br from-pearl/35 to-ocean/25 rounded-full blur-xl animate-pulse delay-1000 shadow-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-teal/15 to-lavender/25 rounded-full blur-3xl animate-bounce-gentle shadow-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-coral/30 rounded-full blur-lg animate-pulse delay-2000 shadow-xl"></div>
        <div className="absolute bottom-32 right-1/3 w-18 h-18 bg-gradient-to-br from-amber/20 to-emerald/25 rounded-full blur-2xl animate-float delay-1500 shadow-2xl"></div>
        
        {/* New subtle particle effects */}
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue/60 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-mint/70 rounded-full animate-heartbeat delay-1200"></div>
        <div className="absolute top-1/4 left-2/3 w-1 h-1 bg-sage/80 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced floating icons with glass morphism effects */}
      <div className="absolute top-12 left-12 opacity-40 animate-float">
        <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-glass">
          <Heart className="w-10 h-10 text-coral animate-pulse" />
        </div>
      </div>
      <div className="absolute top-16 right-16 opacity-50 animate-bounce-gentle delay-500">
        <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
          <Sparkles className="w-8 h-8 text-blue animate-pulse delay-500" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-35 animate-float delay-1000">
        <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-glass">
          <Shield className="w-12 h-12 text-sage" />
        </div>
      </div>
      <div className="absolute bottom-48 right-24 opacity-40 animate-pulse delay-1500">
        <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
          <Clock className="w-9 h-9 text-ocean" />
        </div>
      </div>
      
      <div className="relative z-10 space-y-12 animate-fade-in">
        {/* Enhanced friendly badge with better contrast */}
        <div className="flex justify-center animate-slide-in-bottom" style={{animationDelay: '0.2s'}}>
          <Badge variant="glass" size="xl" className="px-8 py-4 text-lg font-semibold shadow-glow backdrop-blur-xl border-white/30">
            <Sparkles className="w-6 h-6 text-blue mr-3" />
            Welcome to Your Health Journey
          </Badge>
        </div>
        
        {/* Enhanced main heading with improved typography and gradient */}
        <div className="space-y-6 animate-slide-in-bottom" style={{animationDelay: '0.4s'}}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-ocean via-blue to-teal bg-clip-text text-transparent">Your Health,</span>
            <br />
            <span className="text-navy drop-shadow-sm">Our Priority</span>
            <br />
            <span className="bg-gradient-to-r from-mint via-sage to-seafoam bg-clip-text text-transparent">Made Simple</span>
          </h1>
        </div>
        
        {/* Enhanced subheading with better readability */}
        <div className="animate-slide-in-bottom" style={{animationDelay: '0.6s'}}>
          <p className="text-xl md:text-2xl lg:text-3xl text-navy/75 max-w-5xl mx-auto leading-relaxed font-medium">
            Experience healthcare that truly cares about <span className="text-blue font-semibold">you</span>. From prescription uploads to doorstep delivery, 
            we're here to make your wellness journey as <span className="text-sage font-semibold">smooth</span> and <span className="text-coral font-semibold">friendly</span> as possible.
          </p>
        </div>
        
        {/* Enhanced call-to-action buttons with better hierarchy */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-12 animate-slide-in-bottom" style={{animationDelay: '0.8s'}}>
          <Button 
            variant="gradient"
            size="xl" 
            effect="shimmer"
            className="px-12 py-8 rounded-2xl shadow-glow hover:shadow-glow-lg group text-xl font-semibold"
          >
            <span className="mr-4">Start Your Journey</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="xl"
            className="border-2 border-blue/60 text-blue hover:bg-blue hover:text-white px-12 py-8 rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl font-semibold backdrop-blur-sm"
          >
            <span>Learn More</span>
          </Button>
        </div>
        
        {/* Enhanced trust indicators with better visual design */}
        <div className="flex flex-wrap justify-center gap-12 pt-16 animate-slide-in-bottom" style={{animationDelay: '1s'}}>
          {[
            { text: "Trusted by 50,000+ families", color: "bg-gradient-to-r from-sage to-mint", icon: Heart },
            { text: "Licensed pharmacists", color: "bg-gradient-to-r from-blue to-ocean", icon: Shield },
            { text: "Same-day delivery", color: "bg-gradient-to-r from-teal to-seafoam", icon: Clock }
          ].map((item, index) => (
            <div key={item.text} className="flex items-center gap-4 text-lg group hover:scale-105 transition-transform duration-300">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-navy/75 font-semibold group-hover:text-navy transition-colors duration-200">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
