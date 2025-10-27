import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

// 🔹 Fetch all available applications (for dropdown)
export const applicationFind = (payload: any) => {
  return axios.get(`${API}/competition/applications/list`, {
    params: payload,
  });
};

// 🔹 5. Compare Tata + Competitor products (NEW unified endpoint)
export const competitionCompareFilter = async (filters: any) => {
  const res = await axios.post(`${API}/competition-products/filter`, filters);
  return res.data; // ✅ now returns { success, totalReal, data: { real, competitors } }
};
