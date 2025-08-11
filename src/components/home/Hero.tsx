import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { heroImages } from "@/data/products";

export default function Hero() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-lg">
                <img
                  src={img}
                  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="container mx-auto pb-8 md:pb-0 md:pl-8 max-w-4xl text-white animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                      Tata Commercial Vehicles for Every Business
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-white/90">
                      Explore SCV, Pickup, LCV, ICV, MCV, Winger & Buses — Book
                      a test drive, view offers, and get instant finance
                      options.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button variant="hero">Book Test Drive</Button>
                      <Button variant="accent">View Current Offers</Button>
                      <Button className="bg-sky-400 text-black hover:bg-yellow-400 transition-colors">
                        Download Brochure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
