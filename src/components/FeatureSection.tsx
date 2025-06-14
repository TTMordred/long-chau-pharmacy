
import { Upload, Heart, Star, Clock, CheckCircle, Pill, Sparkles, Shield, Zap, FileText, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeatureSection = () => {
  const navigate = useNavigate();

  const handleUploadPrescription = () => {
    navigate('/upload-prescription');
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue/20 to-mint/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-mint/10 to-sage/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-mint/30 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-blue" />
            <span className="text-sm font-semibold text-navy">Why Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight">
            Why Families Choose
            <br />
            <span className="bg-gradient-to-r from-blue via-mint to-sage bg-clip-text text-transparent">
              Long Chau
            </span>
          </h2>
          
          <p className="text-xl text-navy/70 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience healthcare designed with care, built with trust, and delivered with a smile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Main Hero Feature Card - Upload Prescription */}
          <Card className="lg:col-span-8 bg-gradient-to-br from-white via-mint/5 to-blue/5 border border-mint/20 overflow-hidden relative group hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] animate-in slide-in-from-left duration-1000 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5 opacity-50"></div>
            
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue via-mint to-sage opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-700"></div>
            
            <CardContent className="relative z-10 p-10 h-full min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue/10 to-mint/10 backdrop-blur-md rounded-2xl border border-blue/20 shadow-lg">
                      <FileText className="w-5 h-5 mr-3 text-blue" />
                      <span className="font-semibold text-navy">Prescription Upload</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-bold text-navy leading-tight">
                      Upload & Verify
                      <br />
                      <span className="bg-gradient-to-r from-blue to-mint bg-clip-text text-transparent">
                        Instantly
                      </span>
                    </h3>
                    
                    <p className="text-lg text-navy/80 leading-relaxed max-w-md">
                      Simply upload your prescription photo or PDF and get instant verification from our licensed pharmacists. Safe, secure, and hassle-free.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleUploadPrescription}
                      className="bg-gradient-to-r from-blue to-mint text-white border-0 hover:shadow-xl transition-all duration-300 rounded-2xl px-8 py-4 font-semibold text-lg group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-mint to-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Upload className="w-5 h-5 mr-2 relative z-10" />
                      <span className="relative z-10">Upload Prescription</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="border-2 border-blue/30 text-navy hover:bg-blue/5 transition-all duration-300 rounded-2xl px-8 py-4 font-semibold group"
                    >
                      <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Take Photo
                    </Button>
                  </div>
                  
                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-mint/20">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">Instant Verification</p>
                        <p className="text-navy/60 text-xs">Licensed pharmacists</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-mint/20">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue to-navy rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">100% Secure</p>
                        <p className="text-navy/60 text-xs">HIPAA compliant</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Main upload icon container */}
                    <div className="relative w-48 h-48 bg-gradient-to-br from-white to-mint/20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700 backdrop-blur-sm border border-mint/30">
                      <div className="relative">
                        <Upload className="w-20 h-20 text-blue group-hover:text-mint transition-colors duration-500" />
                        
                        {/* Animated pulse ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-blue/30 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-mint/20 animate-ping delay-1000"></div>
                      </div>
                      
                      {/* Floating prescription icon */}
                      <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-white to-blue/10 rounded-xl flex items-center justify-center shadow-lg border border-blue/20 animate-bounce">
                        <FileText className="w-6 h-6 text-blue" />
                      </div>
                      
                      {/* Floating camera icon */}
                      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-white to-mint/10 rounded-xl flex items-center justify-center shadow-lg border border-mint/20 animate-bounce delay-500">
                        <Camera className="w-6 h-6 text-mint" />
                      </div>
                    </div>
                    
                    {/* Success checkmark */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    
                    {/* Orbital elements */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-mint rounded-full shadow-lg"></div>
                      <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-3 h-3 bg-sage rounded-full shadow-lg"></div>
                      <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-3 h-3 bg-navy rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side Feature Cards */}
          <div className="lg:col-span-4 space-y-6">
            {[
              { 
                icon: Heart, 
                title: 'Health Tips', 
                desc: 'Daily wellness advice from certified experts', 
                gradient: 'from-sage/20 to-mint/20',
                iconGradient: 'from-sage to-mint',
                delay: '300ms' 
              },
              { 
                icon: Star, 
                title: 'Favorites', 
                desc: 'Quick access to your saved items and preferences', 
                gradient: 'from-blue/20 to-navy/20',
                iconGradient: 'from-blue to-navy',
                delay: '500ms' 
              },
              { 
                icon: Clock, 
                title: 'Order Tracking', 
                desc: 'Real-time delivery updates and notifications', 
                gradient: 'from-mint/20 to-blue/20',
                iconGradient: 'from-mint to-blue',
                delay: '700ms' 
              },
              { 
                icon: Shield, 
                title: 'Verified Quality', 
                desc: 'Licensed pharmacy guarantee and quality assurance', 
                gradient: 'from-navy/20 to-sage/20',
                iconGradient: 'from-navy to-sage',
                delay: '900ms' 
              }
            ].map((feature, index) => (
              <Card 
                key={feature.title}
                className={`bg-gradient-to-br ${feature.gradient} border border-mint/30 hover:border-blue/40 transition-all duration-500 hover:scale-105 group animate-in slide-in-from-right duration-1000 shadow-lg hover:shadow-2xl backdrop-blur-sm relative overflow-hidden`}
                style={{ animationDelay: feature.delay }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="relative z-10 p-6 flex items-center space-x-4">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
                    {/* Icon background glow */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-lg text-navy group-hover:text-blue transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-navy/70 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000" style={{ animationDelay: '1000ms' }}>
          {[
            { number: '50K+', label: 'Happy Families', icon: Heart },
            { number: '99.9%', label: 'Uptime Guarantee', icon: Zap },
            { number: '24/7', label: 'Expert Support', icon: Shield }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue/10 to-mint/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-mint/20">
                <stat.icon className="w-8 h-8 text-blue" />
              </div>
              <div className="text-3xl font-bold text-navy mb-2">{stat.number}</div>
              <div className="text-navy/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
