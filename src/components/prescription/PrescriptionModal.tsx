
import { useState } from 'react';
import { X, Download, User, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdatePrescription } from '@/hooks/usePrescriptions';
import { toast } from '@/components/ui/use-toast';
import type { Prescription } from '@/hooks/usePrescriptions';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
  canManage: boolean;
}

const PrescriptionModal = ({ prescription, onClose, canManage }: PrescriptionModalProps) => {
  const updatePrescription = useUpdatePrescription();
  const [notes, setNotes] = useState(prescription?.pharmacist_notes || '');
  const [status, setStatus] = useState(prescription?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!prescription) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updatePrescription.mutateAsync({
        id: prescription.id,
        updates: {
          pharmacist_notes: notes,
          status,
          reviewed_at: new Date().toISOString(),
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update prescription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async () => {
    if (!prescription.prescription_image_url) return;
    
    try {
      const response = await fetch(prescription.prescription_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${prescription.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      toast({
        title: "Download failed",
        description: "Failed to download prescription file.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Prescription Details
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Customer ID</Label>
                  <p className="text-sm text-muted-foreground">{prescription.customer_id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Uploaded</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(prescription.uploaded_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(prescription.status || 'pending')}
                  </div>
                </div>
              </div>

              {prescription.reviewed_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Reviewed</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(prescription.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Prescription Image */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Prescription Image</Label>
              {prescription.prescription_image_url ? (
                <div className="space-y-2">
                  <img
                    src={prescription.prescription_image_url}
                    alt="Prescription"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Management Section */}
          {canManage && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pharmacist Review
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Pharmacist Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this prescription..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-blue-600 to-navy"
                >
                  {isUpdating ? 'Updating...' : 'Update Prescription'}
                </Button>
              </div>
            </div>
          )}

          {/* View Only Notes */}
          {!canManage && prescription.pharmacist_notes && (
            <div className="border-t pt-6 space-y-2">
              <Label className="text-sm font-medium">Pharmacist Notes</Label>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                {prescription.pharmacist_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionModal;
