
import { useState } from 'react';
import { BookOpen, Search, Calendar, User, Tag, ArrowRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardHeader from '@/components/DashboardHeader';
import { useBlogPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';

const BlogPosts = () => {
  const { data: blogPosts, isLoading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const publishedPosts = blogPosts?.filter(post => post.status === 'published') || [];
  
  const uniqueCategories = publishedPosts
    ? Array.from(new Set(publishedPosts.map(post => post.category).filter(Boolean)))
    : [];
  
  let filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort posts
  filteredPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default: // newest
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'technology': 'bg-blue-100 text-blue-700 border-blue-200',
      'health': 'bg-green-100 text-green-700 border-green-200',
      'lifestyle': 'bg-purple-100 text-purple-700 border-purple-200',
      'business': 'bg-orange-100 text-orange-700 border-orange-200',
      'education': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'travel': 'bg-pink-100 text-pink-700 border-pink-200',
      'food': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'science': 'bg-teal-100 text-teal-700 border-teal-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
      <DashboardHeader 
        cartItemsCount={0} 
        onCartClick={() => {}} 
        searchQuery="" 
        onSearchChange={() => {}} 
      />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-navy to-purple-600 bg-clip-text text-transparent mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-navy/70 max-w-3xl mx-auto leading-relaxed">
              Discover insights, stories, and expertise from our team. Stay updated with the latest trends and knowledge in our industry.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy mb-2">Search Articles</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by title, content, or tags..."
                    className="pl-12 h-12 bg-white/90 border-gray-200/50 rounded-xl text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:w-48">
                  <label className="block text-sm font-medium text-navy mb-2">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 bg-white/90 border-gray-200/50 rounded-xl">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 lg:w-40">
                  <label className="block text-sm font-medium text-navy mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 bg-white/90 border-gray-200/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-lg text-navy/70">Loading amazing content...</p>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="p-6 bg-white/60 rounded-3xl shadow-lg inline-block mb-6">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">No articles found</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your search criteria or browse all categories.'
                  : 'We\'re working on creating amazing content for you. Check back soon!'
                }
              </p>
              {(searchQuery || categoryFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                  className="rounded-xl"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Featured Post */}
          {!isLoading && featuredPost && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm mr-3">
                  Featured
                </span>
                Latest Article
              </h2>
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-white/90 backdrop-blur-sm border border-white/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <CardHeader className="p-0">
                    {featuredPost.featured_image_url ? (
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img 
                          src={featuredPost.featured_image_url} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-purple-300" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {featuredPost.category && (
                        <Badge className={`${getCategoryColor(featuredPost.category)} text-xs font-semibold px-3 py-1`}>
                          {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                        </Badge>
                      )}
                      
                      <CardTitle className="text-2xl font-bold group-hover:text-purple-600 transition-colors leading-tight">
                        {featuredPost.title}
                      </CardTitle>
                      
                      {featuredPost.excerpt && (
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {featuredPost.published_at ? format(new Date(featuredPost.published_at), 'MMMM dd, yyyy') : 'Recently published'}
                        </div>
                        
                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}

          {/* Regular Posts Grid */}
          {!isLoading && regularPosts.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-navy">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border border-white/20 overflow-hidden">
                    <CardHeader className="p-0">
                      {post.featured_image_url ? (
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {post.category && (
                          <Badge className={`${getCategoryColor(post.category)} text-xs font-semibold`}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </Badge>
                        )}
                        
                        <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </CardTitle>
                        
                        {post.excerpt && (
                          <p className="text-gray-600 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Recent'}
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg group-hover:scale-110 transition-transform">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;
