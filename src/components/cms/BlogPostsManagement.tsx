
import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, BookOpen, ArrowUpDown, Filter, Search, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '@/hooks/useCMSContent';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import BlogPostEditor from './BlogPostEditor';
import { CMSBlogPost } from '@/hooks/useCMS';

const BlogPostsManagement = () => {
  const { data: posts, isLoading, error } = useBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  const handleCreatePost = async (postData: Partial<CMSBlogPost>) => {
    try {
      await createPost.mutateAsync({
        title: postData.title || '',
        slug: postData.slug || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        category: postData.category || '',
        tags: postData.tags || [],
        featured_image_url: postData.featured_image_url || '',
        status: postData.status || 'draft',
      });
      setIsCreating(false);
      toast({
        title: "Blog post created! 🎉",
        description: "Your blog post has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: "Error creating post",
        description: "There was an error creating your blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async (postData: Partial<CMSBlogPost>) => {
    if (!editingPost) return;
    
    try {
      await updatePost.mutateAsync({
        id: editingPost.id,
        updates: postData,
      });
      setEditingPost(null);
      toast({
        title: "Post updated! ✨",
        description: "Your blog post has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update post:', error);
      toast({
        title: "Error updating post",
        description: "There was an error updating your blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      setIsConfirmingDelete(null);
      toast({
        title: "Post deleted",
        description: "The blog post has been permanently deleted.",
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: "Error deleting post",
        description: "There was an error deleting the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md">Published</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Archived</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">Draft</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    if (!category) return null;
    const colors: { [key: string]: string } = {
      'technology': 'bg-blue-100 text-blue-700 border-blue-200',
      'health': 'bg-green-100 text-green-700 border-green-200',
      'lifestyle': 'bg-purple-100 text-purple-700 border-purple-200',
      'business': 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return <Badge variant="outline" className={`${colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'} font-medium`}>{category}</Badge>;
  };
  
  const uniqueCategories = posts 
    ? Array.from(new Set(posts.map(post => post.category).filter(Boolean)))
    : [];
  
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Blog Posts Management
          </CardTitle>
          <CardDescription className="text-red-600">Error loading blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load blog posts: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isCreating) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <BlogPostEditor
            onSave={handleCreatePost}
            onCancel={() => setIsCreating(false)}
          />
        </CardContent>
      </Card>
    );
  }

  if (editingPost) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <BlogPostEditor
            initialData={editingPost}
            onSave={handleUpdatePost}
            onCancel={() => setEditingPost(null)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-purple-600" />
                Blog Posts Management
              </CardTitle>
              <CardDescription className="text-lg text-purple-700">
                Create and manage engaging blog posts for your audience
              </CardDescription>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{filteredPosts.filter(p => p.status === 'published').length} Published</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{filteredPosts.filter(p => p.status === 'draft').length} Drafts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{filteredPosts.filter(p => p.status === 'archived').length} Archived</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreating(true)} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" /> 
              Create New Post
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, content, or slug..."
                  className="pl-10 h-10 bg-white border-gray-300 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {uniqueCategories.length > 0 && (
                <div className="flex-1 lg:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-10 bg-white border-gray-300 rounded-lg">
                      <SelectValue placeholder="Category" />
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
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-lg text-gray-600">Loading your amazing content...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-6">
                <BookOpen className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No blog posts found</h3>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg max-w-md">
                    No posts match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                    }}
                    className="rounded-lg"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg max-w-md">
                    Get started by creating your first amazing blog post.
                  </p>
                  <Button 
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    Create Your First Post
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[300px] font-semibold">
                      <div className="flex items-center">
                        Title & URL
                        <ArrowUpDown className="ml-2 h-3 w-3 text-gray-400" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 line-clamp-2">{post.title}</div>
                          <div className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded inline-block">
                            /blog/{post.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category ? getCategoryBadge(post.category) : (
                          <span className="text-gray-400 text-sm">No category</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status || 'draft')}</TableCell>
                      <TableCell className="text-gray-600">
                        {post.updated_at
                          ? format(new Date(post.updated_at), 'MMM dd, yyyy')
                          : 'Not available'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Preview Feature",
                                description: `Preview for /blog/${post.slug} coming soon!`,
                              });
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPost(post)}
                            className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={isConfirmingDelete === post.id}
                            onOpenChange={(open) => {
                              if (!open) setIsConfirmingDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsConfirmingDelete(post.id)}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-red-600">Delete Blog Post</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Are you sure you want to delete "<strong>{post.title}</strong>"?
                                  This action cannot be undone and will permanently remove the post.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-3 mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsConfirmingDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Post
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostsManagement;
