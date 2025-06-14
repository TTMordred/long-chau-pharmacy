
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, FileText, BookOpen, Users, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useHasRole } from '@/hooks/useUserRoles';
import DashboardHeader from '@/components/DashboardHeader';
import PrescriptionList from '@/components/prescription/PrescriptionList';
import PrescriptionModal from '@/components/prescription/PrescriptionModal';
import PrescriptionStats from '@/components/cms/PrescriptionStats';
import PagesManagement from '@/components/cms/PagesManagement';
import BlogPostsManagement from '@/components/cms/BlogPostsManagement';
import type { Prescription } from '@/hooks/usePrescriptions';

const CMSDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('prescriptions');
  
  const { data: isAdmin } = useHasRole('admin');
  const { data: isContentManager } = useHasRole('content_manager');
  const { data: isPharmacist } = useHasRole('pharmacist');
  
  const hasAccess = isAdmin || isContentManager || isPharmacist;
  const canManagePrescriptions = isPharmacist || isAdmin;
  const canManageContent = isContentManager || isAdmin;

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
    setIsModalOpen(false);
  };

  const getRoleLabel = () => {
    if (isAdmin) return "Administrator";
    if (isPharmacist) return "Pharmacist";
    if (isContentManager) return "Content Manager";
    return "Guest";
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
      <DashboardHeader 
        cartItemsCount={0} 
        onCartClick={() => {}} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy">CMS Dashboard</h1>
              <p className="text-navy/70 mt-2">
                Welcome back, {user.user_metadata?.full_name || 'User'} • <span className="font-medium">{getRoleLabel()}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {canManagePrescriptions && (
                <Button 
                  onClick={() => navigate('/upload-prescription')}
                  className="bg-gradient-to-r from-green-600 to-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Prescription
                </Button>
              )}
              {isAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="border-navy/30 text-navy"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              )}
            </div>
          </div>

          <div className="mb-8">
            <PrescriptionStats />
          </div>

          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto gap-2 sm:gap-0 bg-transparent">
              {canManagePrescriptions && (
                <TabsTrigger 
                  value="prescriptions" 
                  className="flex items-center gap-2 h-12 data-[state=active]:bg-navy data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4" />
                  Prescriptions
                </TabsTrigger>
              )}
              {canManageContent && (
                <TabsTrigger 
                  value="pages" 
                  className="flex items-center gap-2 h-12 data-[state=active]:bg-navy data-[state=active]:text-white"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Pages
                </TabsTrigger>
              )}
              {canManageContent && (
                <TabsTrigger 
                  value="blog" 
                  className="flex items-center gap-2 h-12 data-[state=active]:bg-navy data-[state=active]:text-white"
                >
                  <BookOpen className="w-4 h-4" />
                  Blog Posts
                </TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger 
                  value="users" 
                  className="flex items-center gap-2 h-12 data-[state=active]:bg-navy data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4" />
                  Users
                </TabsTrigger>
              )}
            </TabsList>

            {canManagePrescriptions && (
              <TabsContent value="prescriptions">
                <PrescriptionList
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  canManage={canManagePrescriptions}
                />
              </TabsContent>
            )}

            {canManageContent && (
              <TabsContent value="pages">
                <PagesManagement />
              </TabsContent>
            )}

            {canManageContent && (
              <TabsContent value="blog">
                <BlogPostsManagement />
              </TabsContent>
            )}

            {isAdmin && (
              <TabsContent value="users">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">User Management</h3>
                      <p className="text-muted-foreground">
                        User role management and permissions coming soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {isModalOpen && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
          canManage={canManagePrescriptions}
        />
      )}
    </div>
  );
};

export default CMSDashboard;
