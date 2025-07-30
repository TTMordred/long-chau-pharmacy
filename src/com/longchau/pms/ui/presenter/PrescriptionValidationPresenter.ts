import { IPrescriptionRepository } from '@/com/longchau/pms/persistence/api/IPrescriptionRepository';
import { Prescription } from '@/com/longchau/pms/domain/Prescription';

export interface ValidationResult {
  success: boolean;
  message: string;
}

export class PrescriptionValidationPresenter {
  private prescriptionRepository: IPrescriptionRepository;

  constructor(prescriptionRepo: IPrescriptionRepository) {
    this.prescriptionRepository = prescriptionRepo;
  }

  async getPendingPrescriptions(): Promise<Prescription[]> {
    return await this.prescriptionRepository.findByStatus('pending');
  }

  async getAllPrescriptions(): Promise<Prescription[]> {
    return await this.prescriptionRepository.findAll();
  }

  async approvePrescription(prescriptionId: string, pharmacistNotes?: string): Promise<ValidationResult> {
    try {
      await this.prescriptionRepository.markAsValidated(prescriptionId, true, pharmacistNotes);
      return {
        success: true,
        message: 'Prescription approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve prescription'
      };
    }
  }

  async rejectPrescription(prescriptionId: string, pharmacistNotes: string): Promise<ValidationResult> {
    try {
      if (!pharmacistNotes.trim()) {
        return {
          success: false,
          message: 'Notes are required when rejecting a prescription'
        };
      }

      await this.prescriptionRepository.markAsValidated(prescriptionId, false, pharmacistNotes);
      return {
        success: true,
        message: 'Prescription rejected successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject prescription'
      };
    }
  }

  async updatePrescriptionNotes(prescriptionId: string, notes: string): Promise<ValidationResult> {
    try {
      await this.prescriptionRepository.update(prescriptionId, { pharmacistNotes: notes });
      return {
        success: true,
        message: 'Notes updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update notes'
      };
    }
  }

  isValidatedPrescription(prescription: Prescription): boolean {
    return prescription.status === 'approved';
  }
}
