import { Prescription } from '../domain/Prescription';

export const prescriptionsData: Prescription[] = [
  {
    id: "1",
    customerId: "demo-user-1",
    prescriptionImageUrl: "/prescriptions/sample1.pdf",
    pharmacistNotes: null,
    status: "pending",
    uploadedAt: "2024-12-01T10:00:00Z",
    reviewedAt: null
  },
  {
    id: "2",
    customerId: "demo-user-1",
    prescriptionImageUrl: "/prescriptions/sample2.jpg",
    pharmacistNotes: "Approved for 30 days supply",
    status: "approved",
    uploadedAt: "2024-11-30T15:30:00Z",
    reviewedAt: "2024-12-01T09:15:00Z"
  },
  {
    id: "3",
    customerId: "demo-user-1",
    prescriptionImageUrl: "/prescriptions/sample3.pdf",
    pharmacistNotes: "Image quality too poor, please resubmit",
    status: "rejected",
    uploadedAt: "2024-11-29T14:20:00Z",
    reviewedAt: "2024-11-30T11:45:00Z"
  },
  {
    id: "4",
    customerId: "demo-user-1",
    prescriptionImageUrl: "/prescriptions/sample4.jpg",
    pharmacistNotes: "Approved - High blood pressure medication",
    status: "approved",
    uploadedAt: "2024-11-28T09:00:00Z",
    reviewedAt: "2024-11-28T14:30:00Z"
  },
  {
    id: "5",
    customerId: "demo-user-1",
    prescriptionImageUrl: "/prescriptions/sample5.pdf",
    pharmacistNotes: null,
    status: "pending",
    uploadedAt: "2024-12-02T08:30:00Z",
    reviewedAt: null
  }
];
