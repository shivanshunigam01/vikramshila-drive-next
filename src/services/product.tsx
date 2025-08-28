// src/services/products.ts
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🚀 Fetch all products
export const getProducts = async () => {
  try {
    const res = await axios.get(`${API}/products`);
    if (res.data?.success) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// 🚀 Fetch single product by id
export const getProductById = async (id: string) => {
  const res = await axios.get(`${API}/products/${id}`);
  return res.data.data; // ✅ return the object
};
