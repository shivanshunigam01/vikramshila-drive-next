import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🚀 Create a new lead
export const createLead = async (leadData) => {
  try {
    const res = await axios.post(`${API}/leads/leads-create`, leadData, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data?.success) {
      return res.data; // ✅ success response
    } else {
      throw new Error(res.data?.message || "Failed to submit lead");
    }
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};
