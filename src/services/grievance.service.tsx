import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface GrievancePayload {
  fullName: string;
  mobileNumber: string;
  state: string;
  pincode: string;
  grievanceType: string;
  description: string;
  consentCall: boolean;
  whatsappConsent: boolean;
  briefDescription: string;
  email: string;
}

// 🔹 Submit grievance
export const sendGrievanceService = (data: GrievancePayload) =>
  axios.post(`${API}/grievances/create`, data);
