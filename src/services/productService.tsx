import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

// 🚀 New service for fetching products
export const getProducts = () => {
  return axios.get(`${API}/products`);
};

export const productFind = (payload: any) => {
  return axios.post(`${API}/products/filter`, payload);
};
