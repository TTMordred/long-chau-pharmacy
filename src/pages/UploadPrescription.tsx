
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Camera, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    doctorName: '',
    doctorLicense: '',
    patientName: '',
    prescriptionText: '',
    expiryDate: '',
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
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

    setIsUploading(true);

    try {
      let prescriptionImageUrl = '';

      if (prescriptionFile) {
        const fileExt = prescriptionFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(fileName, prescriptionFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(fileName);

        prescriptionImageUrl = publicUrl;
      }

      await createPrescription.mutateAsync({
        customer_id: user.id,
        doctor_name: formData.doctorName,
        doctor_license: formData.doctorLicense,
        patient_name: formData.patientName,
        prescription_text: formData.prescriptionText,
        prescription_image_url: prescriptionImageUrl,
        status: 'pending',
      });

      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
                    Prescription Image
                  </Label>
                  <div className="border-2 border-dashed border-mint/40 rounded-lg p-6 text-center hover:border-blue/60 transition-colors">
                    <input
                      id="prescription-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="prescription-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-blue" />
                      <p className="text-sm text-navy/70">
                        {prescriptionFile 
                          ? prescriptionFile.name 
                          : "Click to upload prescription image or PDF"
                        }
                      </p>
                    </label>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name" className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Doctor Name
                    </Label>
                    <Input
                      id="doctor-name"
                      placeholder="Dr. John Smith"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doctor-license">Doctor License Number</Label>
                    <Input
                      id="doctor-license"
                      placeholder="License number"
                      value={formData.doctorLicense}
                      onChange={(e) => setFormData({ ...formData, doctorLicense: e.target.value })}
                    />
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-2">
                  <Label htmlFor="patient-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Patient Name
                  </Label>
                  <Input
                    id="patient-name"
                    placeholder="Patient full name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                  />
                </div>

                {/* Prescription Details */}
                <div className="space-y-2">
                  <Label htmlFor="prescription-text">Prescription Details (Optional)</Label>
                  <Textarea
                    id="prescription-text"
                    placeholder="Enter prescription details if image is unclear..."
                    value={formData.prescriptionText}
                    onChange={(e) => setFormData({ ...formData, prescriptionText: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUploading}
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
                    </>
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
