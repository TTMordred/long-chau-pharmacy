
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Calendar, User } from 'lucide-react';
import { useHealthPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const HealthPostsSection = () => {
  const { data: healthPosts, isLoading } = useHealthPosts();

  // Get only published posts and limit to 3 for homepage
  const publishedPosts = healthPosts?.filter(post => post.status === 'published').slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="py-16 relative overflow-hidden">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!publishedPosts.length) {
    return null; // Don't show section if no posts
  }

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
          {publishedPosts.map((post, index) => (
            <Card 
              key={post.id}
              className="bg-white/80 backdrop-blur-sm border border-mint/20 hover:border-sage/40 transition-all duration-300 hover:scale-105 group shadow-lg hover:shadow-xl cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  {post.featured_image_url ? (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-sage/20 to-mint/30 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-sage/60" />
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-sage/90 text-white text-xs font-semibold rounded-full">
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-navy group-hover:text-sage transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-navy/70 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-navy/60">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Health Expert</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {post.published_at 
                          ? format(new Date(post.published_at), 'MMM dd, yyyy')
                          : format(new Date(post.created_at), 'MMM dd, yyyy')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/health">
            <Button 
              className="bg-gradient-to-r from-sage to-mint text-white border-0 hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold group"
            >
              <span>View All Health Posts</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HealthPostsSection;
