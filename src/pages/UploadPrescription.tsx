
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Camera, CheckCircle, AlertCircle, Trash, Search, Filter } from 'lucide-react';
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
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
                <p className="text-muted-foreground mb-4">
                  Please sign in to upload and manage your prescriptions.
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy mb-4">Upload Prescription</h1>
            <p className="text-navy/70 max-w-2xl mx-auto">
              Upload your prescription for review by our pharmacists. We accept JPG, PNG, and PDF files (max 10MB).
              After uploading, you can track the status of your prescriptions below.
            </p>
          </div>

          {/* Upload Form */}
          <Card className="shadow-lg mb-8">
            <CardHeader className="bg-gradient-to-r from-blue to-navy text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Prescription Upload
              </CardTitle>
              <CardDescription className="text-white/80">
                Upload a clear, readable image or PDF of your prescription
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="prescription-file" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Prescription Image or PDF
                  </Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-blue bg-blue/5' 
                        : prescriptionFile 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-mint/40 hover:border-blue/60'
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
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-medium text-green-700">{prescriptionFile.name}</p>
                            <p className="text-sm text-green-600">
                              {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-green-700"
                              onClick={() => setPrescriptionFile(null)}
                            >
                              Change file
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-blue" />
                          <p className="text-sm text-navy/70">
                            Drag and drop or click to upload prescription
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
                    rows={3}
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
                      <Upload className="w-4 h-4 mr-2 animate-pulse" />
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

          {/* Management Table */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Prescriptions
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="w-full pl-9 pr-4"
                    placeholder="Search prescriptions..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 items-center">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                      {filters.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
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
            <CardContent className="overflow-x-auto">
              {isLoading ? (
                <div className="py-8 text-center text-gray-400">Loading...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">
                  Error loading prescriptions: {error.message}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-lg font-medium text-gray-500 mb-1">No prescriptions found</p>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    {search || filters.length > 0 
                      ? "Try adjusting your search or filters" 
                      : "Upload your first prescription to get started"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead>Prescription</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>
                          {getStatusBadge(prescription.status || 'pending')}
                        </TableCell>
                        <TableCell>
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
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
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
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
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
