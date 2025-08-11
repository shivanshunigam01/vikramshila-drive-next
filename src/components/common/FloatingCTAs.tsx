import { Button } from "@/components/ui/button";
import { Car, Gauge } from "lucide-react";

export default function FloatingCTAs() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-40">
      <a href="https://wa.me/919999999999?text=I%20want%20to%20book%20a%20test%20drive" target="_blank" rel="noreferrer">
        <Button variant="accent" className="shadow-elegant"><Gauge /> Test Drive</Button>
      </a>
      <a href="tel:+919999999999">
        <Button variant="hero" className="shadow-elegant"><Car /> Book Now</Button>
      </a>
    </div>
  );
}
