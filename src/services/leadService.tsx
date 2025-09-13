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

export const fetchDemoCibilScore = (
  phone: string,
  pan: string
): Promise<{ score: number; status: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 200) + 650; // random 650–850
      resolve({
        score,
        status: score > 700 ? "Good" : "Needs Improvement",
      });
    }, 2000);
  });
};
