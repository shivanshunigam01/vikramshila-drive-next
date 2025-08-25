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
    <section className="relative bg-black mt-6 md:mt-8 py-6 md:py-8">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div
                className="
                  relative 
                  h-[40vh] sm:h-[55vh] md:h-[70vh] lg:h-[85vh] 
                  w-full
                "
              >
                {/* Responsive Image */}
                <img
                  src={img}
                  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
                  className="w-full h-full object-cover rounded-md md:rounded-none"
                  loading="eager"
                />

                {/* Chatbot — bottom on mobile, top on desktop */}
                <div className="absolute bottom-4 right-4 md:top-4 md:bottom-auto z-50">
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
