
import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useHasRole } from '@/hooks/useUserRoles';
import DashboardHeader from '@/components/DashboardHeader';
import PrescriptionList from '@/components/prescription/PrescriptionList';
import PrescriptionModal from '@/components/prescription/PrescriptionModal';
import CMSStats from '@/components/cms/CMSStats';
import { useNavigate } from 'react-router-dom';
import type { Prescription } from '@/hooks/usePrescriptions';

const CMSDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: isAdmin } = useHasRole('admin');
  const { data: isContentManager } = useHasRole('content_manager');
  const { data: isPharmacist } = useHasRole('pharmacist');
  
  const hasAccess = isAdmin || isContentManager || isPharmacist;
  const canManagePrescriptions = isPharmacist || isAdmin;

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
              <h1 className="text-3xl font-bold text-navy">Management Dashboard</h1>
              <p className="text-navy/70 mt-2">
                {isAdmin && "Full system administration"}
                {isPharmacist && !isAdmin && "Prescription management"}
                {isContentManager && !isAdmin && !isPharmacist && "Content management"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/upload-prescription')}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prescription
              </Button>
            </div>
          </div>

          <CMSStats />

          <Tabs defaultValue="prescriptions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prescriptions">
              <PrescriptionList
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                canManage={canManagePrescriptions}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Detailed analytics and reporting features coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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

            <TabsContent value="settings">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                    <p className="text-muted-foreground">
                      System configuration and settings coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
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
