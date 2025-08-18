import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { heroImages } from "@/data/products";
import Chatbot from "../common/Chatbot";

export default function Hero() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      // Go next, and if it's the last slide, jump back to first
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // loop back to first slide
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative bg-black text-white">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-lg">
                {/* Image without forced dark background */}
                <img
                  src={img}
                  alt={`Hero banner ${idx + 1} — Vikramshila Automobiles`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute top-4 right-4 z-50">
                  <Chatbot inline />
                </div>

                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" /> */}

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="container mx-auto pb-8 md:pb-0 md:pl-8 max-w-4xl text-white animate-fade-in">
                    {/* <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                      Tata Commercial Vehicles for Every Business
                    </h1> */}
                    {/* <p className="mt-3 text-sm md:text-base text-gray-200">
                      Explore SCV, Pickup, LCV, ICV, MCV, Winger & Buses — Book
                      a test drive, view offers, and get instant finance
                      options.
                    </p> */}

                    {/* Buttons */}
                    {/* <div className="mt-5 flex flex-wrap gap-3">
                      <Button className="bg-white text-black hover:bg-gray-300">
                        Book Test Drive
                      </Button>
                      <Button className="bg-primary text-white hover:bg-primary/80">
                        View Current Offers
                      </Button>
                      <Button className="bg-sky-500 text-black hover:bg-yellow-400 transition-colors">
                        Download Brochure
                      </Button>
                    </div> */}
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
