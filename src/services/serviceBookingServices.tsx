import axios from "axios";

const API = "https://api.vikramshilaautomobiles.com/api";
export const createServiceBooking = (data: FormData | Record<string, any>) => {
  return axios.post(`${API}/service-booking`, data, {
    headers:
      data instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
};
