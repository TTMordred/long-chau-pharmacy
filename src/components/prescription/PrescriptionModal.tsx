import { useState } from 'react';
import { X, Eye, FileText, Calendar, User, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdatePrescription } from '@/hooks/usePrescriptions';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import PrescriptionToProductConverter from './PrescriptionToProductConverter';
import type { Prescription } from '@/hooks/usePrescriptions';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
  canManage: boolean;
}

const PrescriptionModal = ({ prescription, onClose, canManage }: PrescriptionModalProps) => {
  const [notes, setNotes] = useState(prescription?.pharmacist_notes || '');
  const [status, setStatus] = useState(prescription?.status || 'pending');
  const [showOrderConverter, setShowOrderConverter] = useState(false);
  const updatePrescription = useUpdatePrescription();

  if (!prescription) return null;

  const handleStatusUpdate = async () => {
    try {
      await updatePrescription.mutateAsync({
        id: prescription.id,
        updates: {
          status,
          pharmacist_notes: notes,
          reviewed_at: new Date().toISOString(),
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update prescription:', error);
    }
  };

  const getStatusBadge = (prescriptionStatus: string) => {
    switch (prescriptionStatus) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      default:
        return <Badge>{prescriptionStatus}</Badge>;
    }
  };

  const handleOrderCreated = () => {
    setShowOrderConverter(false);
    toast({
      title: "Order created successfully",
      description: "The prescription has been converted to an order.",
    });
    onClose();
  };

  if (showOrderConverter && prescription.status === 'approved') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <PrescriptionToProductConverter
            prescription={prescription}
            onOrderCreated={handleOrderCreated}
            onCancel={() => setShowOrderConverter(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Prescription Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">ID:</span>
              <span className="font-mono text-sm">{prescription.id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Uploaded:</span>
              <span className="text-sm">
                {format(new Date(prescription.uploaded_at), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm">{prescription.customer_id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              {getStatusBadge(prescription.status || 'pending')}
            </div>
          </div>

          {prescription.prescription_image_url && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Prescription Image</Label>
              <div className="mt-2 border rounded-lg p-2">
                <img
                  src={prescription.prescription_image_url}
                  alt="Prescription"
                  className="max-w-full h-auto rounded"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open(prescription.prescription_image_url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
          )}

          {canManage && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Pharmacist Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this prescription..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {prescription.pharmacist_notes && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Pharmacist Notes</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                {prescription.pharmacist_notes}
              </div>
            </div>
          )}

          {prescription.reviewed_at && (
            <div className="text-xs text-gray-500">
              Last reviewed: {format(new Date(prescription.reviewed_at), 'MMM dd, yyyy HH:mm')}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div>
            {prescription.status === 'approved' && (
              <Button
                onClick={() => setShowOrderConverter(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Convert to Order
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {canManage && (
              <Button onClick={handleStatusUpdate}>
                Update Prescription
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
