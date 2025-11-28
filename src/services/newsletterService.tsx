// services/newsletterService.ts
const API_URL = import.meta.env.VITE_API_URL || "";

export const subscribeNewsletter = async (email: string) => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) throw new Error("Email is required");

  if (API_URL) {
    const res = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmedEmail }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Subscribe failed");
    }

    return await res.json();
  } else {
    // fallback: localStorage
    const k = "newsletter_emails";
    const current = JSON.parse(localStorage.getItem(k) || "[]");
    if (!current.includes(trimmedEmail)) current.push(trimmedEmail);
    localStorage.setItem(k, JSON.stringify(current));
    return { success: true, message: "Subscribed locally" };
  }
};
