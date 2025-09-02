import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/login-customer`, data);

export const sendOtp = (phone: string) =>
  axios.post(`${API}/auth/send-otp`, { phone });

export const verifyOtp = (phone: string, otp: string) =>
  axios.post(`${API}/auth/verify-otp`, { phone, otp });

export const registerUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/register-customer`, data);
