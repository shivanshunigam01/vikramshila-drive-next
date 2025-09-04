import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

// 🔹 Enquiry request payload
export interface EnquiryPayload {
  fullName: string;
  mobileNumber: string;
  state: string;
  pincode: string;
  //   product: string;
  briefDescription?: string;
  whatsappConsent: boolean;
}

// 🔹 Submit enquiry
export const sendEnquiryService = (data: EnquiryPayload) =>
  axios.post(`${API}/enquiries`, data);
