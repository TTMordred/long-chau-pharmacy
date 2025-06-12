
import { Upload, Heart, Star, Clock, CheckCircle, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeatureSection = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-navy">
          Why Families Choose Long Chau
        </h2>
        <p className="text-lg text-navy/80 max-w-2xl mx-auto font-medium">
          Experience healthcare designed with care, built with trust, and delivered with a smile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feature Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-navy via-blue to-mint text-white border-none overflow-hidden relative group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-left duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-blue/90 to-mint/90"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <CardContent className="relative z-10 p-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full min-h-[300px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                    <Pill className="w-4 h-4 mr-2" />
                    AI-Powered Care
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                    Upload & Verify
                    <br />
                    <span className="text-mint">In Seconds</span>
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Our AI-powered system instantly verifies prescriptions with licensed pharmacists for your safety and peace of mind
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-navy transition-all duration-300 rounded-2xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Prescription
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Upload className="w-16 h-16 text-white/80" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-sage rounded-full animate-ping"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-mint rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Feature Cards */}
        <div className="space-y-6">
          {[
            { icon: Heart, title: 'Health Tips', desc: 'Daily wellness advice from experts', color: 'from-sage to-mint', delay: '200ms' },
            { icon: Star, title: 'Favorites', desc: 'Quick access to your saved items', color: 'from-blue to-navy', delay: '400ms' },
            { icon: Clock, title: 'Order Tracking', desc: 'Real-time delivery updates', color: 'from-mint to-blue', delay: '600ms' },
            { icon: CheckCircle, title: 'Verified', desc: 'Licensed pharmacy guarantee', color: 'from-navy to-sage', delay: '800ms' }
          ].map((feature, index) => (
            <Card 
              key={feature.title}
              className="bg-white/90 backdrop-blur-sm border border-mint/50 hover:bg-white transition-all duration-500 hover:scale-105 group animate-in slide-in-from-right duration-700 shadow-lg hover:shadow-xl"
              style={{ animationDelay: feature.delay }}
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-navy group-hover:text-blue transition-colors duration-300">
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
    </div>
  );
};

export default FeatureSection;
