
import { useState } from 'react';
import { Eye, Edit, Trash2, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrescriptions, useUpdatePrescription } from '@/hooks/usePrescriptions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Prescription } from '@/hooks/usePrescriptions';

interface PrescriptionListProps {
  onViewDetails: (prescription: Prescription) => void;
  onEdit: (prescription: Prescription) => void;
  canManage: boolean;
}

const PrescriptionList = ({ onViewDetails, onEdit, canManage }: PrescriptionListProps) => {
  const { data: prescriptions, isLoading } = usePrescriptions();
  const updatePrescription = useUpdatePrescription();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updatePrescription.mutateAsync({
        id,
        updates: {
          status: newStatus,
          reviewed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to update prescription status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Prescription deleted",
        description: "The prescription has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
      toast({
        title: "Download failed",
        description: "Failed to download prescription file.",
        variant: "destructive",
      });
    }
  };

  const filteredPrescriptions = prescriptions?.filter(prescription => {
    const matchesSearch = prescription.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.pharmacist_notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading prescriptions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Management</CardTitle>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by customer ID or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Reviewed</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell className="font-medium">
                  {prescription.customer_id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(prescription.status || 'pending')}
                    {getStatusBadge(prescription.status || 'pending')}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(prescription.uploaded_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {prescription.reviewed_at ? new Date(prescription.reviewed_at).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="max-w-32 truncate">
                  {prescription.pharmacist_notes || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(prescription)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {prescription.prescription_image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(
                          prescription.prescription_image_url!,
                          `prescription-${prescription.id}.jpg`
                        )}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {canManage && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(prescription)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(prescription.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {canManage && prescription.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleStatusUpdate(prescription.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(prescription.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PrescriptionList;
