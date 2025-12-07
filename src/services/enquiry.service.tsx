import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔹 Enquiry request payload
export interface EnquiryPayload {
  fullName: string;
  mobileNumber: string;
  state: string;
  city: string;
  pincode: string;
  briefDescription: string;
  whatsappConsent: boolean;
}

// 🔹 Submit enquiry
export const sendEnquiryService = (data: EnquiryPayload) =>
  axios.post(`${API}/enquiries`, data);
