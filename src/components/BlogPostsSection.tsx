
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const BlogPostsSection = () => {
  const { data: blogPosts, isLoading } = useBlogPosts();

  // Get only published posts and limit to 2 for homepage
  const publishedPosts = blogPosts?.filter(post => post.status === 'published').slice(0, 2) || [];

  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5 relative overflow-hidden">
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
    <div className="py-16 bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue/20 to-navy/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-mint/15 to-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-blue/30 shadow-lg">
            <BookOpen className="w-4 h-4 mr-2 text-blue" />
            <span className="text-sm font-semibold text-navy">Latest Updates</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            From Our
            <span className="bg-gradient-to-r from-blue via-navy to-mint bg-clip-text text-transparent"> Blog</span>
          </h2>
          
          <p className="text-lg text-navy/70 max-w-2xl mx-auto">
            Stay updated with the latest news, insights, and developments from Long Chau
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          {publishedPosts.map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card 
                className="bg-white/90 backdrop-blur-sm border border-blue/20 hover:border-navy/40 transition-all duration-300 hover:scale-105 group shadow-lg hover:shadow-2xl cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-0">
                  <div className="lg:flex lg:h-64">
                    {/* Image Section */}
                    <div className="lg:w-2/5 relative overflow-hidden">
                      {post.featured_image_url ? (
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-48 lg:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 lg:h-full bg-gradient-to-br from-blue/20 to-navy/30 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-blue/60" />
                        </div>
                      )}
                      {post.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-blue/90 text-white text-xs font-semibold rounded-full">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="font-bold text-xl text-navy group-hover:text-blue transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-navy/70 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-mint/20 text-navy text-xs rounded-full"
                              >
                                <Tag className="w-2 h-2" />
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-mint/20 text-navy text-xs rounded-full">
                                <Tag className="w-2 h-2" />
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-navy/60 mt-4 pt-4 border-t border-mint/20">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Editorial Team</span>
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
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/blog">
            <Button 
              className="bg-gradient-to-r from-blue to-navy text-white border-0 hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold group"
            >
              <span>Read More Articles</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsSection;
