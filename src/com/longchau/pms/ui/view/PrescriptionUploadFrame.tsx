import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PrescriptionUploadPresenter } from '@/com/longchau/pms/ui/presenter/PrescriptionUploadPresenter';
import { FileBasedPrescriptionRepository } from '@/com/longchau/pms/persistence/file/FileBasedPrescriptionRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';

interface PrescriptionUploadFrameProps {
  customerId: string;
  onUploadSuccess?: (prescription: Prescription) => void;
}

export const PrescriptionUploadFrame: React.FC<PrescriptionUploadFrameProps> = ({
  customerId,
  onUploadSuccess
}) => {
  const [presenter] = useState(() => 
    new PrescriptionUploadPresenter(new FileBasedPrescriptionRepository())
  );
  
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userPrescriptions, setUserPrescriptions] = useState<Prescription[]>([]);

  React.useEffect(() => {
    loadUserPrescriptions();
  }, []);

  const loadUserPrescriptions = async () => {
    try {
      const prescriptions = await presenter.getUserPrescriptions(customerId);
      setUserPrescriptions(prescriptions);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const result = await presenter.submitPrescription(file, customerId, notes);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setFile(null);
        setNotes('');
        if (result.prescription && onUploadSuccess) {
          onUploadSuccess(result.prescription);
        }
        await loadUserPrescriptions();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Upload failed' 
      });
    } finally {
      setIsUploading(false);
    }
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
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending Validation</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Prescription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prescription-file">Prescription File</Label>
              <Input
                id="prescription-file"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: JPG, PNG, PDF (max 10MB)
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information for the pharmacist..."
                rows={3}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? 'Uploading...' : 'Upload Prescription'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* User's Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userPrescriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No prescriptions uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {userPrescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(prescription.status)}
                      {getStatusBadge(prescription.status)}
                    </div>
                    <span className="text-sm text-gray-500">
                      Uploaded: {new Date(prescription.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {prescription.pharmacistNotes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Pharmacist Notes:</p>
                      <p className="text-sm text-gray-700">{prescription.pharmacistNotes}</p>
                    </div>
                  )}
                  
                  {prescription.reviewedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reviewed: {new Date(prescription.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
