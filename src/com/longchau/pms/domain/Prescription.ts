export interface Prescription {
  id: string;
  customerId: string;
  prescriptionImageUrl: string | null;
  pharmacistNotes: string | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface NewPrescription {
  customerId: string;
  prescriptionImageUrl: string | null;
  pharmacistNotes: string | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  reviewedAt?: string | null;
}
