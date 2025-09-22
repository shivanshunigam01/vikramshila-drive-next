// src/services/leadService.ts
import axios from "axios";

import { loadRazorpay } from "@/lib/loadRazorpay";
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

export interface FetchCibilPayload {
  name: string; // full name as per PAN
  consent: "Y" | "N"; // must be "Y" to pull bureau
  mobile: string; // 10-digit
  pan: string; // ABCDE1234F
}

export async function fetchCibil(payload: FetchCibilPayload): Promise<{
  ok: boolean;
  score: number | null;
  report_number?: number | null;
  report_date?: number | null;
  report_time?: number | null;
}> {
  await loadRazorpay();

  const { data: order } = await axios.post(`${API}/payment/razorpay/order`);
  if (!order?.id) throw new Error("Order creation failed");

  // ---- helpers ----
  const toNum = (v: any): number | null => {
    const n = v === "" || v == null ? NaN : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const pickScore = (d: any): number | null => {
    if (!d) return null;

    const candidates = [
      d.score, // flat
      d.credit_score, // flat alt
      d?.data?.score,
      d?.data?.credit_score,
      d?.result?.score,
      d?.result?.credit_score,

      d?.credit_report?.score,
      d?.credit_report?.Score,
      d?.credit_report?.credit_score,
      d?.credit_report?.CreditScore?.scoreValue,
      d?.credit_report?.BureauScore?.scoreValue,
      d?.credit_report?.ScoreDetails?.Score,
      d?.credit_report?.ScoreDetails?.score,
      d?.credit_report?.CreditProfileSummary?.Score,
    ];

    for (const v of candidates) {
      const n = toNum(v);
      if (n != null) return n;
    }
    return null;
  };

  const pickMeta = (d: any) => {
    const cr =
      d?.credit_report ||
      d?.data?.credit_report ||
      d?.result?.credit_report ||
      {};
    const hdr = cr?.CreditProfileHeader || cr?.creditProfileHeader || {};
    return {
      report_number:
        toNum(d?.report_number) ??
        toNum(cr?.report_number) ??
        toNum(cr?.ReportNumber) ??
        toNum(hdr?.ReportNumber) ??
        null,
      report_date:
        toNum(d?.report_date) ??
        toNum(cr?.report_date) ??
        toNum(cr?.ReportDate) ??
        toNum(hdr?.ReportDate) ??
        null,
      report_time:
        toNum(d?.report_time) ??
        toNum(cr?.report_time) ??
        toNum(cr?.ReportTime) ??
        toNum(hdr?.ReportTime) ??
        null,
    };
  };
  // -----------------

  return new Promise((resolve, reject) => {
    const RazorpayCtor = (window as any).Razorpay;
    if (typeof RazorpayCtor !== "function") {
      return reject(new Error("Razorpay SDK not available on window"));
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) return reject(new Error("VITE_RAZORPAY_KEY_ID missing"));

    const options = {
      key,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "Vikramshila Automobiles",
      description: "CIBIL Check Fee",
      order_id: order.id,
      prefill: { name: payload.name, contact: payload.mobile },
      theme: { color: "#3399cc" },
      handler: async (resp: any) => {
        try {
          const { data } = await axios.post(
            `${API}/payment/razorpay/verify-cibil`,
            {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              ...payload,
            }
          );

          const score = pickScore(data);
          const meta = pickMeta(data);
          const ok = Boolean(data?.ok ?? data?.success ?? score != null);

          resolve({
            ok,
            score, // number (e.g., 591) or null
            report_number: meta.report_number,
            report_date: meta.report_date,
            report_time: meta.report_time,
          });
        } catch (e: any) {
          reject(new Error(e?.response?.data?.error || "CIBIL fetch failed"));
        }
      },
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
    };

    try {
      const rzp = new RazorpayCtor(options);
      rzp.on("payment.failed", (e: any) =>
        reject(new Error(e?.error?.description || "Payment failed"))
      );
      rzp.open();
    } catch (err) {
      reject(err);
    }
  });
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
