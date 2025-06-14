
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePrescription } from '@/hooks/usePrescriptions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';

const UploadPrescription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createPrescription = useCreatePrescription();
  
  const [formData, setFormData] = useState({
    pharmacistNotes: '',
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setPrescriptionFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload prescriptions.",
        variant: "destructive",
      });
      return;
    }

    if (!prescriptionFile) {
      toast({
        title: "File required",
        description: "Please select a prescription file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Upload file to storage
      const fileExt = prescriptionFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, prescriptionFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      setUploadProgress(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      setUploadProgress(80);

      // Create prescription record
      await createPrescription.mutateAsync({
        customer_id: user.id,
        prescription_image_url: publicUrl,
        pharmacist_notes: formData.pharmacistNotes,
        status: 'pending',
      });

      setUploadProgress(100);

      // Reset form
      setFormData({ pharmacistNotes: '' });
      setPrescriptionFile(null);
      
      // Navigate back to home after successful upload
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
        <DashboardHeader cartItemsCount={0} onCartClick={() => {}} searchQuery="" onSearchChange={() => {}} />
        <div className="pt-24 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
                <p className="text-muted-foreground mb-4">
                  Please sign in to upload your prescription.
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
      <DashboardHeader cartItemsCount={0} onCartClick={() => {}} searchQuery="" onSearchChange={() => {}} />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy mb-4">Upload Prescription</h1>
            <p className="text-navy/70">
              Upload your prescription for review by our licensed pharmacists
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue to-navy text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Prescription Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="prescription-file" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Prescription Image or PDF
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    prescriptionFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-mint/40 hover:border-blue/60'
                  }`}>
                    <input
                      id="prescription-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="prescription-file" className="cursor-pointer">
                      {prescriptionFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-medium text-green-700">{prescriptionFile.name}</p>
                            <p className="text-sm text-green-600">
                              {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-blue" />
                          <p className="text-sm text-navy/70">
                            Click to upload prescription image or PDF
                          </p>
                          <p className="text-xs text-navy/50 mt-1">
                            Supports JPG, PNG, PDF (max 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="pharmacist-notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="pharmacist-notes"
                    placeholder="Any additional information for the pharmacist..."
                    value={formData.pharmacistNotes}
                    onChange={(e) => setFormData({ ...formData, pharmacistNotes: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || !prescriptionFile}
                  className="w-full h-12 bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90"
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Prescription
                    <//>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
