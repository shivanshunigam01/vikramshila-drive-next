import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

// 🚀 New service for fetching products
export const getProducts = () => {
  return axios.get(`${API}/products`);
};

export const productFind = (payload: any) => {
  return axios.post(`${API}/competition-products/filter`, payload);
};

export const downloadBrochureService = (id: string) => {
  return axios.get(`${API}/products/${id}/download-brochure`, {
    responseType: "blob", // important for file downloads
  });
};

export const applicationFind = (payload: any) => {
  return axios.get(`${API}/products/applications/list`, { params: payload });
};
