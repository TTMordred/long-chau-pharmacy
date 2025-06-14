
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Calendar, User } from 'lucide-react';

const HealthPostsSection = () => {
  // Mock health posts data - in a real app this would come from your CMS
  const healthPosts = [
    {
      id: 1,
      title: "5 Essential Vitamins for Daily Wellness",
      excerpt: "Discover the key vitamins your body needs every day to maintain optimal health and energy levels.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      author: "Dr. Sarah Chen",
      date: "2024-06-10",
      category: "Nutrition"
    },
    {
      id: 2,
      title: "Managing Seasonal Allergies Naturally",
      excerpt: "Learn effective natural remedies and prevention strategies for seasonal allergies without heavy medications.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      author: "Dr. Michael Rodriguez",
      date: "2024-06-08",
      category: "Wellness"
    },
    {
      id: 3,
      title: "The Importance of Regular Health Checkups",
      excerpt: "Why routine health screenings are crucial for early detection and prevention of serious health conditions.",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop",
      author: "Dr. Emily Zhang",
      date: "2024-06-05",
      category: "Prevention"
    }
  ];

  return (
    <div className="py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-20 h-20 bg-gradient-to-br from-sage/20 to-mint/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-blue/10 to-sage/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-sage/30 shadow-lg">
            <Heart className="w-4 h-4 mr-2 text-sage" />
            <span className="text-sm font-semibold text-navy">Health & Wellness</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            Latest Health
            <span className="bg-gradient-to-r from-sage via-mint to-blue bg-clip-text text-transparent"> Insights</span>
          </h2>
          
          <p className="text-lg text-navy/70 max-w-2xl mx-auto">
            Expert advice and tips to help you live your healthiest life
          </p>
        </div>

        {/* Health Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {healthPosts.map((post, index) => (
            <Card 
              key={post.id}
              className="bg-white/80 backdrop-blur-sm border border-mint/20 hover:border-sage/40 transition-all duration-300 hover:scale-105 group shadow-lg hover:shadow-xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-sage/90 text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-navy group-hover:text-sage transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-navy/70 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-navy/60">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            className="bg-gradient-to-r from-sage to-mint text-white border-0 hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold group"
          >
            <span>View All Health Posts</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthPostsSection;
