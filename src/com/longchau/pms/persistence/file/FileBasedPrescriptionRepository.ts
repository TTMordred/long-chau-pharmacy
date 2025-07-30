import { IPrescriptionRepository } from '../api/IPrescriptionRepository';
import { Prescription, NewPrescription } from '@/com/longchau/pms/domain/Prescription';
import { prescriptionsData } from '../../data/prescriptions';

export class FileBasedPrescriptionRepository implements IPrescriptionRepository {
  private prescriptions: Prescription[] = [...prescriptionsData];
  private nextId = this.prescriptions.length + 1;

  async findById(id: string): Promise<Prescription | null> {
    const prescription = this.prescriptions.find(p => p.id === id);
    return prescription || null;
  }

  async findAll(): Promise<Prescription[]> {
    return [...this.prescriptions];
  }

  async findByCustomerId(customerId: string): Promise<Prescription[]> {
    return this.prescriptions.filter(p => p.customerId === customerId);
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Prescription[]> {
    return this.prescriptions.filter(p => p.status === status);
  }

  async save(prescription: NewPrescription): Promise<Prescription> {
    const newPrescription: Prescription = {
      ...prescription,
      id: this.nextId.toString(),
      uploadedAt: new Date().toISOString(),
      reviewedAt: prescription.reviewedAt || null
    };
    
    this.prescriptions.push(newPrescription);
    this.nextId++;
    
    return newPrescription;
  }

  async update(id: string, updates: Partial<Prescription>): Promise<Prescription> {
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Prescription with id ${id} not found`);
    }

    this.prescriptions[index] = { ...this.prescriptions[index], ...updates };
    return this.prescriptions[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Prescription with id ${id} not found`);
    }

    this.prescriptions.splice(index, 1);
  }

  async markAsValidated(id: string, isApproved: boolean, notes?: string): Promise<void> {
    const prescription = this.prescriptions.find(p => p.id === id);
    if (!prescription) {
      throw new Error(`Prescription with id ${id} not found`);
    }

    prescription.status = isApproved ? 'approved' : 'rejected';
    prescription.pharmacistNotes = notes || null;
    prescription.reviewedAt = new Date().toISOString();
  }
}
