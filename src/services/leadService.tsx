// src/services/leadService.ts
import axios from "axios";

  const API = import.meta.env.VITE_VITE_API_URL;

export const createLead = async (payload: FormData | Record<string, any>) => {
  try {
    if (payload instanceof FormData) {
      const { data } = await axios.post(`${API}/leads/leads-create`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
        timeout: 30000,
      });
      return data;
    } else {
      const { data } = await axios.post(`${API}/leads`, payload, {
        withCredentials: false,
        timeout: 30000,
      });
      return data;
    }
  } catch (error: any) {
    return (
      error?.response?.data || { success: false, message: "Network error" }
    );
  }
};

export const fetchDemoCibilScore = (
  phone: string,
  pan: string
): Promise<{ score: number; status: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 200) + 650; // random 650–850
      resolve({
        score,
        status: score > 700 ? "Good" : "Needs Improvement",
      });
    }, 2000);
  });
};
export interface FetchCibilPayload {
  name: string; // full name as per PAN
  consent: "Y" | "N"; // must be "Y" to pull bureau
  mobile: string; // 10-digit
  pan: string; // ABCDE1234F
}

export async function fetchCibil(payload: FetchCibilPayload) {
  try {
    const res = await axios.post(`${API}/credit/experian-report`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });

    if (!res.data.ok) {
      throw new Error(res.data?.error || "CIBIL fetch failed");
    }

    return {
      ok: res.data.ok,
      score: res.data.score ? Number(res.data.score) : null, // 👈 convert to number
      report_number: res.data.report_number ?? null,
      report_date: res.data.report_date ?? null,
      report_time: res.data.report_time ?? null,
    };
  } catch (err: any) {
    throw new Error(
      err.response?.data?.error || err.message || "CIBIL fetch failed"
    );
  }
}



export async function downloadCibilReport(cibilData: any, userData: any) {
  try {
    const resp = await fetch(`${API}/credit/download-cibil-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cibilData, userData }),
    });

    if (!resp.ok) {
      throw new Error("Failed to generate CIBIL PDF");
    }

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "cibil-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
    throw err;
  }
}