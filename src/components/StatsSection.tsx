
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Happy Customers',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      value: '99.9%',
      label: 'Uptime Guarantee',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: Clock,
      value: '< 30min',
      label: 'Average Delivery',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Award,
      value: '5.0★',
      label: 'Customer Rating',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
