
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const ModernStatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Happy Customers",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Customer Satisfaction",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Available Support",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      value: "1M+",
      label: "Orders Delivered",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500 delay-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernStatsSection;
