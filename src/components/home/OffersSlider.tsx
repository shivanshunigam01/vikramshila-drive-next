import { Button } from "@/components/ui/button";
import { offers } from "@/data/products";
import { useEffect, useState } from "react";

export default function OffersSlider() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % offers.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container mx-auto py-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Current Schemes & Offers</h2>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        {offers.map((o, i) => (
          <div key={o.title} className={`rounded-lg border p-6 bg-secondary ${i === index ? "animate-enter" : "opacity-60"}`}>
            <h3 className="text-xl font-semibold">{o.title}</h3>
            <p className="text-sm text-muted-foreground">{o.subtitle}</p>
            <p className="text-xs mt-2">Valid till {o.expires}</p>
            <div className="mt-4">
              <Button variant="accent">Claim This Offer</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
