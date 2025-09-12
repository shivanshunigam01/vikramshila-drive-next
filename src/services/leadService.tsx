// src/services/leadService.ts
import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL || "/api";

export const createLead = async (payload: FormData | Record<string, any>) => {
  try {
    if (payload instanceof FormData) {
      const { data } = await axios.post(`${API}/leads/leads-create`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
        timeout: 30000,
      });
      return data;
    } else {
      const { data } = await axios.post(`${API}/leads`, payload, {
        withCredentials: false,
        timeout: 30000,
      });
      return data;
    }
  } catch (error: any) {
    return (
      error?.response?.data || { success: false, message: "Network error" }
    );
  }
};
