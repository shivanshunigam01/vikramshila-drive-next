// src/lib/loadRazorpay.ts
let loadPromise: Promise<void> | null = null;

function mustReloadBadGlobal(): boolean {
  const g: any = (window as any).Razorpay;
  // If it exists but isn't callable (constructor), it's a bad global.
  return !!g && typeof g !== "function";
}

export function loadRazorpay(): Promise<void> {
  // If already a good constructor, we're done.
  if (
    (window as any).Razorpay &&
    typeof (window as any).Razorpay === "function"
  ) {
    return Promise.resolve();
  }

  // If a bad global leaked in, purge and reload.
  if (mustReloadBadGlobal()) {
    try {
      delete (window as any).Razorpay;
    } catch {
      (window as any).Razorpay = undefined;
    }
  }

  // If we're already loading, reuse the promise.
  if (loadPromise) return loadPromise;

  // Remove any previous <script> tags to avoid double-load weirdness.
  document
    .querySelectorAll('script[src*="checkout.razorpay.com/v1/checkout.js"]')
    .forEach((s) => s.remove());

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).Razorpay === "function") resolve();
      else reject(new Error("Razorpay loaded but global is not a constructor"));
    };
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay checkout.js"));
    document.body.appendChild(script);
  });

  return loadPromise.finally(() => {
    loadPromise = null; // allow retries if needed
  });
}
