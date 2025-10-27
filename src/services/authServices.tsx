import axios from "axios";

const API = import.meta.env.VITE_VITE_API_URL;

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/login-customer`, data);

// export const sendOtp = (phone: string) =>
//   axios.post(`${API}/auth/send-otp`, { phone });

export const verifyOtp = (phone: string, otp: string) =>
  axios.post(`${API}/auth/verify-otp`, { phone, otp });

export const registerUser = (data: { email: string; password: string }) =>
  axios.post(`${API}/auth/register-customer`, data);

export const checkCustomer = (phone: string) =>
  axios.post(`${API}/auth/check-customer`, { phone });

export const sendOtp = (phone: string) =>
  axios.post(`${API}/auth/send-otp`, { phone });

export const otpLogin = (data: {
  phone: string;
  otp: string;
  name?: string;
  email?: string;
}) => axios.post(`${API}/auth/otp-login`, data);

/**
 * 🔹 Admin / Employee Login
 */
export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${API}/auth/login`, data, {});

    if (res.data?.success) {
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      localStorage.setItem("auth", "true");
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.data?.message || "Invalid login" };
    }
  } catch (error: any) {
    console.error("Login API error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};
