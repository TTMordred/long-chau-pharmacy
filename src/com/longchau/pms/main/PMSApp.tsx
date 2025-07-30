import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrescriptionUploadFrame } from '@/com/longchau/pms/ui/view/PrescriptionUploadFrame';
import { PrescriptionValidationFrame } from '@/com/longchau/pms/ui/view/PrescriptionValidationFrame';
import { OrderCreationFrame } from '@/com/longchau/pms/ui/view/OrderCreationFrame';
import { InventoryManagementFrame } from '@/com/longchau/pms/ui/view/InventoryManagementFrame';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';

/**
 * Main PMS Application demonstrating the MVP architecture
 * 
 * This component serves as the main entry point for the Pharmacy Management System.
 * It demonstrates the vertical slice implementation of the four required business operations:
 * 
 * 1. Digital Prescription Submission (Task 3)
 * 2. Pharmacist Prescription Validation (Task 5) 
 * 3. Order Placement with Prescription (Task 4)
 * 4. Real-time Inventory Management (Task 7)
 */
export const PMSApp: React.FC = () => {
  const [currentUser] = useState({
    id: 'demo-user-1',
    role: 'customer' as 'customer' | 'pharmacist' | 'staff'
  });
  
  const [userPrescriptions, setUserPrescriptions] = useState<Prescription[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load user prescriptions when component mounts or when refresh is triggered
  React.useEffect(() => {
    const loadPrescriptions = async () => {
      const repo = new FileBasedPrescriptionRepository();
      const prescriptions = await repo.findByCustomerId(currentUser.id);
      setUserPrescriptions(prescriptions);
    };
    
    loadPrescriptions();
  }, [currentUser.id, refreshTrigger]);

  const handlePrescriptionUpdate = () => {
    // Trigger a refresh of prescriptions
    setRefreshTrigger(prev => prev + 1);
  };

  const validatedPrescriptions = userPrescriptions.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pharmacy Management System (PMS)
          </h1>
          <p className="text-gray-600 mb-4">
            MVP Architecture Implementation - University Assignment Demo
          </p>
          
          {/* User Info */}
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Current User: {currentUser.id}</p>
                <p className="text-sm text-gray-600">Role: <Badge variant="outline">{currentUser.role}</Badge></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Prescriptions: {userPrescriptions.length} total, {validatedPrescriptions.length} validated
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Architecture Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Architecture Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📁 Repository Pattern</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• IProductRepository</li>
                  <li>• IPrescriptionRepository</li>
                  <li>• IOrderRepository</li>
                  <li>• File-based implementations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 MVP Pattern</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Models: Domain entities</li>
                  <li>• Views: React components</li>
                  <li>• Presenters: Business logic</li>
                  <li>• Separation of concerns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 Vertical Slice</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Prescription submission</li>
                  <li>• Pharmacist validation</li>
                  <li>• Order creation</li>
                  <li>• Inventory management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">
              📤 Task 3: Upload Prescription
            </TabsTrigger>
            <TabsTrigger value="validation">
              ✅ Task 5: Validate Prescriptions
            </TabsTrigger>
            <TabsTrigger value="order">
              🛒 Task 4: Create Order
            </TabsTrigger>
            <TabsTrigger value="inventory">
              📦 Task 7: Manage Inventory
            </TabsTrigger>
          </TabsList>

          {/* Task 3: Digital Prescription Submission */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Task 3: Digital Prescription Submission</CardTitle>
                <p className="text-sm text-gray-600">
                  Customers can upload prescription files. System marks status as "Pending Validation".
                </p>
              </CardHeader>
              <CardContent>
                <PrescriptionUploadFrame
                  customerId={currentUser.id}
                  onUploadSuccess={handlePrescriptionUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task 5: Pharmacist Prescription Validation */}
          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle>Task 5: Pharmacist Prescription Validation</CardTitle>
                <p className="text-sm text-gray-600">
                  Pharmacists can view pending prescriptions and "Approve" or "Reject" them with notes.
                </p>
              </CardHeader>
              <CardContent>
                <PrescriptionValidationFrame />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task 4: Order Placement with Prescription */}
          <TabsContent value="order">
            <Card>
              <CardHeader>
                <CardTitle>Task 4: Order Placement with Prescription</CardTitle>
                <p className="text-sm text-gray-600">
                  Staff can add validated prescription items to orders. System prevents adding unvalidated prescriptions.
                </p>
              </CardHeader>
              <CardContent>
                <OrderCreationFrame
                  customerId={currentUser.id}
                  validatedPrescriptions={validatedPrescriptions}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task 7: Real-time Inventory Management */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Task 7: Real-time Inventory Management</CardTitle>
                <p className="text-sm text-gray-600">
                  When orders are completed, system automatically decrements stock levels. Shows before/after stock levels.
                </p>
              </CardHeader>
              <CardContent>
                <InventoryManagementFrame />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            University Assignment Demo - MVP Architecture with Repository Pattern
          </p>
          <p>
            File-based persistence simulation • Vertical slice implementation
          </p>
        </div>
      </div>
    </div>
  );
};
