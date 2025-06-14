import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Camera, CheckCircle, AlertCircle, Trash, Search, Filter, ArrowLeft, Sparkles, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { 
  useCreatePrescription, 
  useDeletePrescription, 
  usePrescriptions, 
  Prescription 
} from '@/hooks/usePrescriptions';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const UploadPrescription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createPrescription = useCreatePrescription();
  const deletePrescription = useDeletePrescription();
  
  const [formData, setFormData] = useState({
    pharmacistNotes: '',
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<Prescription[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch all prescriptions, filter for only the user's prescriptions
  const { data: prescriptions, isLoading, error } = usePrescriptions();

  // Status filter options
  const filterOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Effect to filter prescriptions based on search and filters
  const filterPrescriptions = useCallback(() => {
    if (!user || !prescriptions) {
      setFiltered([]);
      return;
    }

    let filteredData = prescriptions.filter(p => p.customer_id === user.id);
    
    if (search.trim()) {
      filteredData = filteredData.filter(p =>
        (p.pharmacist_notes ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.status ?? '').toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.length > 0) {
      filteredData = filteredData.filter(p => filters.includes(p.status || ''));
    }
    
    // Sort by uploaded date (newest first)
    filteredData.sort((a, b) => {
      return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    });
    
    setFiltered(filteredData);
  }, [prescriptions, user, search, filters]);
  
  // Call filterPrescriptions whenever dependencies change
  useState(() => {
    filterPrescriptions();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or PDF file.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    setPrescriptionFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
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
      // Create or verify customer profile
      const { data: existingCustomer, error: customerFetchError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
        
      if (customerFetchError) {
        throw new Error('Error checking customer: ' + customerFetchError.message);
      }
      
      if (!existingCustomer) {
        const { error: customerInsertError } = await supabase
          .from('customers')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Unknown User',
          });
          
        if (customerInsertError) {
          throw new Error('Failed to create customer profile: ' + customerInsertError.message);
        }
      }
      
      // Upload file to storage
      const fileExt = prescriptionFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, prescriptionFile);
        
      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      
      setUploadProgress(60);
      
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
        reviewed_at: null,
      });
      
      setUploadProgress(100);
      setFormData({ pharmacistNotes: '' });
      setPrescriptionFile(null);
      
      setTimeout(() => {
        filterPrescriptions();
      }, 500);
      
      toast({
        title: "Prescription uploaded successfully",
        description: "Your prescription has been submitted for review.",
      });
    } catch (error) {
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    await deletePrescription.mutateAsync(id);
    filterPrescriptions();
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => filterPrescriptions(), 100);
  };
  
  const handleFilterChange = (value: string) => {
    setFilters(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
    setTimeout(() => filterPrescriptions(), 100);
  };
  
  const clearFilters = () => {
    setSearch('');
    setFilters([]);
    setTimeout(() => filterPrescriptions(), 100);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending':  
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'rejected': 
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewPrescription = (url: string) => {
    window.open(url, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/10 via-mint/5 to-blue/10">
        <DashboardHeader cartItemsCount={0} onCartClick={() => {}} searchQuery="" onSearchChange={() => {}} />
        <div className="pt-24 px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-navy">Sign In Required</h2>
                <p className="text-navy/70 mb-6">
                  Please sign in to upload and manage your prescriptions securely.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue to-mint text-white border-0 hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
      
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue/10 to-mint/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-sage/20 to-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="pt-24 px-4 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-blue/30 text-navy hover:bg-blue/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex-1">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-mint/30 shadow-lg mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-blue" />
                <span className="text-sm font-semibold text-navy">Prescription Upload</span>
              </div>
              <h1 className="text-3xl font-bold text-navy mb-2">Upload Your Prescription</h1>
              <p className="text-navy/70 max-w-2xl">
                Upload your prescription for instant verification by our licensed pharmacists. We accept JPG, PNG, and PDF files up to 10MB.
              </p>
            </div>
          </div>

          {/* Upload Form */}
          <Card className="shadow-xl mb-8 border-0 bg-white/90 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue via-mint to-sage text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  Prescription Upload
                </CardTitle>
                <CardDescription className="text-white/90 mt-2">
                  Upload a clear, readable image or PDF of your prescription for instant verification
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label htmlFor="prescription-file" className="flex items-center gap-2 text-navy font-semibold">
                    <Camera className="w-5 h-5 text-blue" />
                    Prescription Image or PDF
                  </Label>
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-blue bg-blue/5 scale-105' 
                        : prescriptionFile 
                          ? 'border-green-400 bg-green-50/50' 
                          : 'border-mint/40 hover:border-blue/60 hover:bg-mint/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      id="prescription-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!prescriptionFile}
                    />
                    <label htmlFor="prescription-file" className="cursor-pointer">
                      {prescriptionFile ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-700 text-lg">{prescriptionFile.name}</p>
                            <p className="text-sm text-green-600 mb-4">
                              {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="border-green-300 text-green-700 hover:bg-green-50"
                              onClick={() => setPrescriptionFile(null)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Change file
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue/10 to-mint/20 rounded-2xl flex items-center justify-center mx-auto">
                            <Upload className="w-10 h-10 text-blue" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-navy mb-2">
                              Drag and drop or click to upload
                            </p>
                            <p className="text-sm text-navy/60">
                              Supports JPG, PNG, PDF (max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 text-sm">Instant Verification</p>
                      <p className="text-green-600 text-xs">Licensed pharmacists</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue to-navy rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue text-sm">100% Secure</p>
                      <p className="text-blue/70 text-xs">HIPAA compliant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-mint-50 to-mint-100/50 rounded-xl border border-mint-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-mint to-sage rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-mint text-sm">Fast Processing</p>
                      <p className="text-mint/70 text-xs">Usually under 30 minutes</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <Label htmlFor="pharmacist-notes" className="text-navy font-semibold">Additional Notes (Optional)</Label>
                  <Textarea
                    id="pharmacist-notes"
                    placeholder="Any additional information for the pharmacist (allergies, special instructions, etc.)..."
                    value={formData.pharmacistNotes}
                    onChange={(e) => setFormData({ ...formData, pharmacistNotes: e.target.value })}
                    rows={4}
                    className="border-mint/30 focus:border-blue resize-none"
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-4 p-6 bg-gradient-to-r from-blue/5 to-mint/5 rounded-xl border border-blue/20">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-navy">Uploading your prescription...</span>
                      <span className="text-blue">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue to-mint h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-xs text-navy/60">Please wait while we securely upload and process your prescription.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || !prescriptionFile}
                  className="w-full h-14 bg-gradient-to-r from-blue to-mint hover:from-blue/90 hover:to-mint/90 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-mint to-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isUploading ? (
                    <>
                      <Upload className="w-5 h-5 mr-3 animate-pulse relative z-10" />
                      <span className="relative z-10">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-3 relative z-10" />
                      <span className="relative z-10">Submit Prescription</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Management Table */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 border-b border-mint/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue to-mint rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                My Prescriptions
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="w-full pl-10 pr-4 border-mint/30 focus:border-blue"
                    placeholder="Search prescriptions..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 items-center border-mint/30 hover:bg-mint/5">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                      {filters.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white/95 backdrop-blur-md border-mint/30">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterOptions.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={filters.includes(option.value)}
                        onCheckedChange={() => handleFilterChange(option.value)}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue to-mint rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-navy/60">Loading your prescriptions...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-red-600 font-medium">Error loading prescriptions</p>
                  <p className="text-red-500 text-sm">{error.message}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-500 mb-2">No prescriptions found</p>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                    {search || filters.length > 0 
                      ? "Try adjusting your search or filters" 
                      : "Upload your first prescription to get started"}
                  </p>
                  {!search && filters.length === 0 && (
                    <Button 
                      onClick={() => document.getElementById('prescription-file')?.click()}
                      className="bg-gradient-to-r from-blue to-mint text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload First Prescription
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-mint/20">
                      <TableHead className="font-semibold text-navy">Status</TableHead>
                      <TableHead className="font-semibold text-navy">Date Uploaded</TableHead>
                      <TableHead className="font-semibold text-navy">Prescription</TableHead>
                      <TableHead className="font-semibold text-navy">Notes</TableHead>
                      <TableHead className="text-right font-semibold text-navy">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((prescription, index) => (
                      <TableRow key={prescription.id} className="border-mint/10 hover:bg-mint/5 transition-colors">
                        <TableCell>
                          {getStatusBadge(prescription.status || 'pending')}
                        </TableCell>
                        <TableCell className="text-navy/70">
                          {prescription.uploaded_at
                            ? format(new Date(prescription.uploaded_at), "MMM d, yyyy")
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {prescription.prescription_image_url ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewPrescription(prescription.prescription_image_url || '')}
                              className="text-blue hover:bg-blue/10"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-navy/70">
                          {prescription.pharmacist_notes && prescription.pharmacist_notes.length > 0
                            ? prescription.pharmacist_notes
                            : <span className="text-gray-400">-</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(prescription.id)}
                            >
                              <Trash className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
