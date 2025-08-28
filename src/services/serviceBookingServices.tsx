import axios from "axios";

const API = import.meta.env.API_URL || "http://localhost:5000/api";

export const createServiceBooking = (data: FormData | Record<string, any>) => {
  return axios.post(`${API}/service-booking`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
};
