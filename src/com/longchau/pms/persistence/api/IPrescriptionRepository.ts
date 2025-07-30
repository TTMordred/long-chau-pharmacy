import { Prescription, NewPrescription } from '@/com/longchau/pms/domain/Prescription';

export interface IPrescriptionRepository {
  findById(id: string): Promise<Prescription | null>;
  findAll(): Promise<Prescription[]>;
  findByCustomerId(customerId: string): Promise<Prescription[]>;
  findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Prescription[]>;
  save(prescription: NewPrescription): Promise<Prescription>;
  update(id: string, updates: Partial<Prescription>): Promise<Prescription>;
  delete(id: string): Promise<void>;
  markAsValidated(id: string, isApproved: boolean, notes?: string): Promise<void>;
}
