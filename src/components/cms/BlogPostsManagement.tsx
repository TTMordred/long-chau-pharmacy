import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, BookOpen, ArrowUpDown } from 'lucide-react';
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
    } catch (error) {
      console.error('Failed to create post:', error);
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
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      setIsConfirmingDelete(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-gray-500">Archived</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    if (!category) return null;
    return <Badge variant="outline">{category}</Badge>;
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
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts Management</CardTitle>
          <CardDescription>Error loading blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load blog posts: {error.message}</p>
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Blog Posts Management</CardTitle>
            <CardDescription>Create and manage blog posts</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Plus className="mr-2 h-4 w-4" /> Create New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search posts..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {uniqueCategories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No blog posts found</h3>
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? (
              <p className="text-muted-foreground">
                No posts match your current filters. Try adjusting your search.
              </p>
            ) : (
              <p className="text-muted-foreground mt-2 mb-6">
                Get started by creating your first blog post.
              </p>
            )}
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Post
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{post.title}</span>
                        <span className="text-xs text-muted-foreground">/blog/{post.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>{post.category ? getCategoryBadge(post.category) : '-'}</TableCell>
                    <TableCell>{getStatusBadge(post.status || 'draft')}</TableCell>
                    <TableCell>
                      {post.updated_at
                        ? format(new Date(post.updated_at), 'MMM dd, yyyy')
                        : 'Not available'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement post preview
                            toast({
                              title: "Preview",
                              description: `Preview for /blog/${post.slug}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPost(post)}
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
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Blog Post</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the blog post "{post.title}"?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsConfirmingDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Delete
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
  );
};

export default BlogPostsManagement;
