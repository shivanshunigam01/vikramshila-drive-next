import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createServiceBooking = (data: FormData) => {
  return axios.post(`${API}/service-booking`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
