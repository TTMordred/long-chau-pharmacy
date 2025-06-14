
import { useState } from 'react';
import { Heart, Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
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
import { useHealthPosts } from '@/hooks/useCMSContent';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Health = () => {
  const { data: healthPosts, isLoading } = useHealthPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const publishedPosts = healthPosts?.filter(post => post.status === 'published') || [];
  
  const uniqueCategories = publishedPosts
    ? Array.from(new Set(publishedPosts.map(post => post.category).filter(Boolean)))
    : [];
  
  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'wellness': 'bg-green-100 text-green-700',
      'nutrition': 'bg-orange-100 text-orange-700',
      'fitness': 'bg-blue-100 text-blue-700',
      'mental-health': 'bg-purple-100 text-purple-700',
      'preventive-care': 'bg-teal-100 text-teal-700',
      'chronic-conditions': 'bg-red-100 text-red-700',
      'medications': 'bg-indigo-100 text-indigo-700',
      'lifestyle': 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-pink-600 mr-3" />
              <h1 className="text-4xl font-bold text-navy">Health & Wellness</h1>
            </div>
            <p className="text-xl text-navy/70 max-w-3xl mx-auto">
              Discover expert health advice, wellness tips, and medical insights to help you live your healthiest life.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search health articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Health Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-lg">Loading health articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No health articles found</h3>
              <p className="text-gray-600">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Health articles will appear here once they are published.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/health/${post.slug}`}>
                  <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="p-0">
                      {post.featured_image_url && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {post.category && (
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                          </Badge>
                        )}
                        
                        <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">
                          {post.title}
                        </CardTitle>
                        
                        {post.excerpt && (
                          <p className="text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Recently'}
                          </div>
                          
                          <div className="flex items-center text-pink-600 hover:text-pink-700 transition-colors">
                            <span className="text-sm font-medium">Read More</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Health;
