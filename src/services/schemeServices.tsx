// src/services/schemes.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getSchemes() {
  try {
    const res = await axios.get(`${API_URL}/schemes`);
    if (res.data?.success) {
      return res.data.data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching schemes:", err);
    return [];
  }
}
