
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, BookOpen, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/DashboardHeader';
import { useBlogPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';

const BlogPost = () => {
  const { slug } = useParams();
  const { data: blogPosts, isLoading } = useBlogPosts();
  
  const post = blogPosts?.find(p => p.slug === slug && p.status === 'published');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5">
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
      <div className="min-h-screen bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5">
        <DashboardHeader 
          cartItemsCount={0} 
          onCartClick={() => {}} 
          searchQuery="" 
          onSearchChange={() => {}} 
        />
        <div className="pt-24 px-4 pb-12">
          <div className="max-w-4xl mx-auto text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog">
              <Button className="bg-gradient-to-r from-blue to-navy text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-mint/10 to-sage/5">
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
            <Link to="/blog" className="inline-flex items-center text-blue hover:text-blue/80 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <article className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
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
                  <Badge className="bg-blue/10 text-blue border border-blue/20">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-navy/70 mb-8 pb-6 border-b border-blue/20">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Editorial Team</span>
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
                  <span>7 min read</span>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8">
                  <p className="text-lg text-navy/80 leading-relaxed font-medium bg-gradient-to-r from-blue/10 to-navy/10 p-6 rounded-xl border-l-4 border-blue">
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
                  <h3 className="text-lg font-semibold text-navy mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-blue border-blue/30 hover:bg-blue/10">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="pt-6 border-t border-blue/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-navy font-medium">Share this article:</span>
                    <Button variant="outline" size="sm" className="border-blue/30 text-blue hover:bg-blue/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Link to="/blog">
                    <Button variant="outline" className="border-blue/30 text-blue hover:bg-blue/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      More Articles
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

export default BlogPost;
