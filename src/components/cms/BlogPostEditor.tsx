
import React, { useState, useEffect } from 'react';
import { Save, X, FileImage, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useUploadCMSMedia } from '@/hooks/useCMSContent';
import { CMSBlogPost } from '@/hooks/useCMS';

interface BlogPostEditorProps {
  initialData?: CMSBlogPost;
  onSave: (postData: Partial<CMSBlogPost>) => Promise<void>;
  onCancel: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('content');
  const uploadMedia = useUploadCMSMedia();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<Partial<CMSBlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured_image_url: '',
    status: 'draft',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category || '',
        tags: initialData.tags || [],
        featured_image_url: initialData.featured_image_url || '',
        status: initialData.status || 'draft',
      });
      
      if (initialData.tags) {
        setTags(initialData.tags);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      setTags(newTags);
      setFormData(prev => ({ ...prev, tags: newTags }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or WebP image.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const publicUrl = await uploadMedia.mutateAsync({ file, path: 'blog' });
      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Featured image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="button" 
                variant="secondary"
                onClick={generateSlug}
                className="mb-0.5"
              >
                Generate from Title
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief summary of your post"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="font-mono"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.featured_image_url && (
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={formData.featured_image_url} 
                    alt="Featured" 
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="featured-image">Upload Featured Image</Label>
                <Input
                  id="featured-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                />
              </div>
              
              {formData.featured_image_url && (
                <div className="space-y-2">
                  <Label htmlFor="featured-image-url">Image URL</Label>
                  <Input
                    id="featured-image-url"
                    name="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Post category"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      id="tag-input"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    variant="secondary"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs py-1">
                      {tag}
                      <button 
                        type="button" 
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {initialData?.published_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Published on {new Date(initialData.published_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default BlogPostEditor;
