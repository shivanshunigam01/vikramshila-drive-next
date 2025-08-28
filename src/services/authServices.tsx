import axios from "axios";

const API = import.meta.env.API_URL || "http://localhost:5000/api";

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/login`, data);

export const sendOtp = (email: string) =>
  axios.post(`${API}/otp/send-otp`, { email });

export const verifyOtp = (email: string, otp: string) =>
  axios.post(`${API}/otp/verify-otp`, { email, otp });

export const registerUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/otp/register`, data);
