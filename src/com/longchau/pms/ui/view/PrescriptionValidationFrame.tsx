import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PrescriptionValidationPresenter } from '@/com/longchau/pms/ui/presenter/PrescriptionValidationPresenter';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';

export const PrescriptionValidationFrame: React.FC = () => {
  const [presenter] = useState(() => 
    new PrescriptionValidationPresenter(new FileBasedPrescriptionRepository())
  );

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [pharmacistNotes, setPharmacistNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadPrescriptions();
  }, [filter]);

  const loadPrescriptions = async () => {
    setIsLoading(true);
    try {
      let data: Prescription[];
      if (filter === 'all') {
        data = await presenter.getAllPrescriptions();
      } else if (filter === 'pending') {
        data = await presenter.getPendingPrescriptions();
      } else {
        // For approved/rejected, get all and filter
        const allPrescriptions = await presenter.getAllPrescriptions();
        data = allPrescriptions.filter(p => p.status === filter);
      }
      setPrescriptions(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load prescriptions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (prescriptionId: string) => {
    const result = await presenter.approvePrescription(prescriptionId, pharmacistNotes);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setSelectedPrescription(null);
      setPharmacistNotes('');
      await loadPrescriptions();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleReject = async (prescriptionId: string) => {
    const result = await presenter.rejectPrescription(prescriptionId, pharmacistNotes);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setSelectedPrescription(null);
      setPharmacistNotes('');
      await loadPrescriptions();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const openPrescriptionDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setPharmacistNotes(prescription.pharmacistNotes || '');
    setMessage(null);
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prescription Validation Dashboard
          </CardTitle>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption)}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`p-3 rounded-md mb-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">Loading prescriptions...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {filter === 'all' ? '' : filter} prescriptions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.customerId.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(prescription.status)}
                        {getStatusBadge(prescription.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(prescription.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {prescription.reviewedAt 
                        ? new Date(prescription.reviewedAt).toLocaleDateString() 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPrescriptionDetails(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <Card>
          <CardHeader>
            <CardTitle>Review Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer ID</Label>
                <p className="text-sm font-mono">{selectedPrescription.customerId}</p>
              </div>
              <div>
                <Label>Current Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedPrescription.status)}
                  {getStatusBadge(selectedPrescription.status)}
                </div>
              </div>
              <div>
                <Label>Uploaded</Label>
                <p className="text-sm">{new Date(selectedPrescription.uploadedAt).toLocaleString()}</p>
              </div>
              {selectedPrescription.reviewedAt && (
                <div>
                  <Label>Last Reviewed</Label>
                  <p className="text-sm">{new Date(selectedPrescription.reviewedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {selectedPrescription.prescriptionImageUrl && (
              <div>
                <Label>Prescription Image</Label>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedPrescription.prescriptionImageUrl!, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Prescription
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="pharmacist-notes">Pharmacist Notes</Label>
              <Textarea
                id="pharmacist-notes"
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                placeholder="Add your review notes here..."
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(selectedPrescription.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={selectedPrescription.status === 'approved'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedPrescription.id)}
                variant="destructive"
                disabled={selectedPrescription.status === 'rejected' || !pharmacistNotes.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPrescription(null);
                  setPharmacistNotes('');
                  setMessage(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
