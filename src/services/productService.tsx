import axios from "axios";

const API = import.meta.env.API_URL || "http://localhost:5000/api";

// 🚀 New service for fetching products
export const getProducts = () => {
  return axios.get(`${API}/products`);
};
