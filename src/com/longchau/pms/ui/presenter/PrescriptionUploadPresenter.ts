import { IPrescriptionRepository } from '@/com/longchau/pms/persistence/api/IPrescriptionRepository';
import { NewPrescription, Prescription } from '@/com/longchau/pms/domain/Prescription';

export interface PrescriptionUploadResult {
  success: boolean;
  message: string;
  prescription?: Prescription;
}

export interface PrescriptionValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PrescriptionUploadPresenter {
  private prescriptionRepository: IPrescriptionRepository;

  constructor(prescriptionRepo: IPrescriptionRepository) {
    this.prescriptionRepository = prescriptionRepo;
  }

  async submitPrescription(file: File, customerId: string, notes?: string): Promise<PrescriptionUploadResult> {
    try {
      // Validate file
      const validationResult = this.validateFile(file);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.errors.join(', ')
        };
      }

      // In a real implementation, we would upload the file to storage
      // For this demo, we'll simulate the file URL
      const mockFileUrl = `/prescriptions/${customerId}/${Date.now()}_${file.name}`;

      const prescriptionData: NewPrescription = {
        customerId,
        prescriptionImageUrl: mockFileUrl,
        pharmacistNotes: notes || null,
        status: 'pending', // Always start as pending validation
        reviewedAt: null
      };

      const savedPrescription = await this.prescriptionRepository.save(prescriptionData);

      return {
        success: true,
        message: 'Prescription uploaded successfully and marked as Pending Validation',
        prescription: savedPrescription
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload prescription'
      };
    }
  }

  async getUserPrescriptions(customerId: string): Promise<Prescription[]> {
    return await this.prescriptionRepository.findByCustomerId(customerId);
  }

  private validateFile(file: File): PrescriptionValidationResult {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload JPG, PNG, or PDF files only.');
    }

    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
