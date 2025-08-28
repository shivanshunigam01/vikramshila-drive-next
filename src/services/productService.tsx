import axios from "axios";

const API = "https://api.vikramshilaautomobiles.com/api";

// 🚀 New service for fetching products
export const getProducts = () => {
  return axios.get(`${API}/products`);
};
