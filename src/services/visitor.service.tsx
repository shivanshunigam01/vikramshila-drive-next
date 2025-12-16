export const trackVisit = async (page: string) => {
  try {
    await fetch(import.meta.env.VITE_API_URL + "/visits/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page }),
    });
  } catch (err) {
    // silently fail – never break UX
    console.error("Visitor tracking failed");
  }
};
