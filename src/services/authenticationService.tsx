import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/login-customer`, data);
