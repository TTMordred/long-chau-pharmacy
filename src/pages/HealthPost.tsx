
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Heart, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/DashboardHeader';
import { useHealthPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';

const HealthPost = () => {
  const { slug } = useParams();
  const { data: healthPosts, isLoading } = useHealthPosts();
  
  const post = healthPosts?.find(p => p.slug === slug && p.status === 'published');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
        <DashboardHeader 
          cartItemsCount={0} 
          onCartClick={() => {}} 
          searchQuery="" 
          onSearchChange={() => {}} 
        />
        <div className="pt-24 px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
        <DashboardHeader 
          cartItemsCount={0} 
          onCartClick={() => {}} 
          searchQuery="" 
          onSearchChange={() => {}} 
        />
        <div className="pt-24 px-4 pb-12">
          <div className="max-w-4xl mx-auto text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The health post you're looking for doesn't exist or has been removed.</p>
            <Link to="/health">
              <Button className="bg-gradient-to-r from-sage to-mint text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Health Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'wellness': 'bg-green-100 text-green-700 border-green-200',
      'nutrition': 'bg-orange-100 text-orange-700 border-orange-200',
      'fitness': 'bg-blue-100 text-blue-700 border-blue-200',
      'mental-health': 'bg-purple-100 text-purple-700 border-purple-200',
      'preventive-care': 'bg-teal-100 text-teal-700 border-teal-200',
      'chronic-conditions': 'bg-red-100 text-red-700 border-red-200',
      'medications': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'lifestyle': 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
      <DashboardHeader 
        cartItemsCount={0} 
        onCartClick={() => {}} 
        searchQuery="" 
        onSearchChange={() => {}} 
      />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/health" className="inline-flex items-center text-sage hover:text-sage/80 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Health Posts
            </Link>
          </div>

          {/* Article Header */}
          <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Category Badge */}
              {post.category && (
                <div className="mb-4">
                  <Badge className={`${getCategoryColor(post.category)} border`}>
                    <Heart className="w-3 h-3 mr-1" />
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-navy/70 mb-8 pb-6 border-b border-sage/20">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Health Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.published_at 
                      ? format(new Date(post.published_at), 'MMMM dd, yyyy')
                      : format(new Date(post.created_at), 'MMMM dd, yyyy')
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8">
                  <p className="text-lg text-navy/80 leading-relaxed font-medium bg-gradient-to-r from-sage/10 to-mint/10 p-6 rounded-xl border-l-4 border-sage">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              {post.content && (
                <div className="prose prose-lg max-w-none mb-8">
                  <div 
                    className="text-navy/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-navy mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sage border-sage/30 hover:bg-sage/10">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="pt-6 border-t border-sage/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-navy font-medium">Share this article:</span>
                    <Button variant="outline" size="sm" className="border-sage/30 text-sage hover:bg-sage/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Link to="/health">
                    <Button variant="outline" className="border-sage/30 text-sage hover:bg-sage/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      More Health Posts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default HealthPost;
