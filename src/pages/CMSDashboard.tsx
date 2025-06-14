
import { useState } from 'react';
import { Plus, Edit, Eye, Trash2, FileText, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useCMSPages, useBlogPosts } from '@/hooks/useCMS';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useHasRole } from '@/hooks/useUserRoles';
import DashboardHeader from '@/components/DashboardHeader';
import { useNavigate } from 'react-router-dom';

const CMSDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: isAdmin } = useHasRole('admin');
  const { data: isContentManager } = useHasRole('content_manager');
  const { data: isPharmacist } = useHasRole('pharmacist');
  
  const { data: cmsPages } = useCMSPages();
  const { data: blogPosts } = useBlogPosts();
  const { data: prescriptions } = usePrescriptions();

  const hasAccess = isAdmin || isContentManager || isPharmacist;

  if (!user || !hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
        <DashboardHeader cartItemsCount={0} onCartClick={() => {}} searchQuery="" onSearchChange={() => {}} />
        <div className="pt-24 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
                <p className="text-muted-foreground mb-4">
                  You don't have permission to access the CMS dashboard.
                </p>
                <Button onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: "default",
      draft: "secondary",
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
      <DashboardHeader cartItemsCount={0} onCartClick={() => {}} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy">CMS Dashboard</h1>
              <p className="text-navy/70 mt-2">Manage your content and prescriptions</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Blog
              </TabsTrigger>
              {(isPharmacist || isAdmin) && (
                <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Prescriptions
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cmsPages?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
                  </CardContent>
                </Card>
                
                {(isPharmacist || isAdmin) && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {prescriptions?.filter(p => p.status === 'pending').length || 0}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>CMS Pages</CardTitle>
                    <Button className="bg-gradient-to-r from-blue to-navy">
                      <Plus className="w-4 h-4 mr-2" />
                      New Page
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cmsPages?.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell>{page.slug}</TableCell>
                          <TableCell>{getStatusBadge(page.status || 'draft')}</TableCell>
                          <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Blog Posts</CardTitle>
                    <Button className="bg-gradient-to-r from-blue to-navy">
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts?.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>{getStatusBadge(post.status || 'draft')}</TableCell>
                          <TableCell>
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {(isPharmacist || isAdmin) && (
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Prescription Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescriptions?.map((prescription) => (
                          <TableRow key={prescription.id}>
                            <TableCell>{prescription.patient_name || '-'}</TableCell>
                            <TableCell>{prescription.doctor_name || '-'}</TableCell>
                            <TableCell>{getStatusBadge(prescription.status || 'pending')}</TableCell>
                            <TableCell>{new Date(prescription.uploaded_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
