import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export default function ScrollRevealer() {
  useEffect(() => {
    const sr = ScrollReveal({ distance: "20px", duration: 700, easing: "cubic-bezier(0.4, 0, 0.2, 1)", interval: 100, cleanup: true });
    sr.reveal(".sr-fade", { opacity: 0, origin: "bottom" });
    sr.reveal(".sr-slide", { opacity: 0, origin: "right" });
    return () => sr.destroy();
  }, []);
  return null;
}
