
import { Truck, Shield, Clock, Heart, Sparkles, Zap } from 'lucide-react';

const ModernFeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: "Lightning Fast Delivery",
      description: "Get your medicines delivered to your doorstep in record time with our premium delivery service.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Shield,
      title: "100% Secure & Safe",
      description: "Your health data and transactions are protected with bank-level security encryption.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Clock,
      title: "24/7 Expert Support",
      description: "Our licensed pharmacists are available round the clock to assist you with any queries.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Receive tailored health recommendations based on your medical history and preferences.",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50"
    }
  ];

  return (
    <div className="py-20">
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg">
          <Sparkles className="w-5 h-5 text-blue-500 mr-2 animate-spin-slow" />
          <span className="text-gray-700 font-semibold">Why Choose Us</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 bg-clip-text text-transparent">
          Healthcare Excellence
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Experience the perfect blend of modern technology and personalized care
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Floating elements */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernFeatureSection;
