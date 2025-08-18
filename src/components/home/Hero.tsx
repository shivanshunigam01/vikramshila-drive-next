import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { heroImages } from "@/data/products";
import Chatbot from "../common/Chatbot";

export default function Hero() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative bg-black mt-8 py-8">
      {/* Black background with bigger top margin and bottom padding */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-[65vh] md:h-[75vh] lg:h-[85vh]">
                {/* Full width image inside black background */}
                <img
                  src={img}
                  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                {/* Chatbot top-right */}
                <div className="absolute top-4 right-4 z-50">
                  <Chatbot inline />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
