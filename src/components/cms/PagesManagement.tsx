import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, File, ArrowUpDown } from 'lucide-react';
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
import { usePages, useCreatePage, useUpdatePage, useDeletePage } from '@/hooks/useCMSContent';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import PageEditor from './PageEditor';
import { CMSPage } from '@/hooks/useCMS';

const PagesManagement = () => {
  const { data: pages, isLoading, error } = usePages();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  const handleCreatePage = async (pageData: Partial<CMSPage>) => {
    try {
      await createPage.mutateAsync({
        title: pageData.title || '',
        slug: pageData.slug || '',
        content: pageData.content || '',
        meta_description: pageData.meta_description || '',
        meta_keywords: pageData.meta_keywords || '',
        featured_image_url: pageData.featured_image_url || '',
        status: pageData.status || 'draft',
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handleUpdatePage = async (pageData: Partial<CMSPage>) => {
    if (!editingPage) return;
    
    try {
      await updatePage.mutateAsync({
        id: editingPage.id,
        updates: pageData,
      });
      setEditingPage(null);
    } catch (error) {
      console.error('Failed to update page:', error);
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage.mutateAsync(id);
      setIsConfirmingDelete(null);
    } catch (error) {
      console.error('Failed to delete page:', error);
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
  
  const filteredPages = pages?.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pages Management</CardTitle>
          <CardDescription>Error loading pages</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load pages: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isCreating) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <PageEditor
            onSave={handleCreatePage}
            onCancel={() => setIsCreating(false)}
          />
        </CardContent>
      </Card>
    );
  }

  if (editingPage) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <PageEditor
            initialData={editingPage}
            onSave={handleUpdatePage}
            onCancel={() => setEditingPage(null)}
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
            <CardTitle className="text-2xl">Pages Management</CardTitle>
            <CardDescription>Create and manage website pages</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-green-600 to-green-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Page
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search pages..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No pages found</h3>
            {searchQuery || statusFilter !== 'all' ? (
              <p className="text-muted-foreground">
                No pages match your current filters. Try adjusting your search.
              </p>
            ) : (
              <p className="text-muted-foreground mt-2 mb-6">
                Get started by creating your first page.
              </p>
            )}
            {searchQuery || statusFilter !== 'all' ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Page
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
                  <TableHead className="w-[200px]">URL Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>/{page.slug}</TableCell>
                    <TableCell>{getStatusBadge(page.status || 'draft')}</TableCell>
                    <TableCell>
                      {page.updated_at
                        ? format(new Date(page.updated_at), 'MMM dd, yyyy')
                        : 'Not available'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement page preview
                            toast({
                              title: "Preview",
                              description: `Preview for /${page.slug}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPage(page)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={isConfirmingDelete === page.id}
                          onOpenChange={(open) => {
                            if (!open) setIsConfirmingDelete(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsConfirmingDelete(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Page</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the page "{page.title}"?
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
                                onClick={() => handleDeletePage(page.id)}
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

export default PagesManagement;
