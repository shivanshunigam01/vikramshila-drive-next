import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import catScv from "@/assets/cat-scv.jpg";
import catPickup from "@/assets/cat-pickup.jpg";
import catLcv from "@/assets/cat-lcv.jpg";
import catIcv from "@/assets/cat-icv.jpg";
import catMcv from "@/assets/cat-mcv.jpg";
import catWinger from "@/assets/cat-winger.jpg";
import catBus from "@/assets/cat-bus.jpg";
import ace1 from "@/assets/acepro-1.jpg";
import ace2 from "@/assets/acepro-2.jpg";
import ace3 from "@/assets/acepro-3.jpg";
import ace4 from "@/assets/acepro-4.jpg";

export type Vehicle = {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  brochureUrl?: string;
  priceListUrl?: string;
  specs: { key: string; value: string }[];
  variants: string[];
};

export const heroImages = [hero1, hero2, hero3, hero4];

export const categories = [
  { key: "scv-cargo", title: "SCV Cargo", image: catScv, description: "Smart city cargo solutions for quick and efficient deliveries." },
  { key: "pickup", title: "Pickup", image: catPickup, description: "Rugged performance for every terrain and business need." },
  { key: "lcv", title: "LCV", image: catLcv, description: "Light commercial vehicles built for reliability and mileage." },
  { key: "icv", title: "ICV", image: catIcv, description: "Intermediate CVs with power and payload for growth." },
  { key: "mcv", title: "MCV", image: catMcv, description: "Medium CVs for long hauls and heavy duty operations." },
  { key: "winger", title: "Winger", image: catWinger, description: "Comfort-first people mover for city and intercity routes." },
  { key: "buses", title: "Buses", image: catBus, description: "Safe, spacious, and efficient buses for all journeys." },
];

export const vehicles: Vehicle[] = [
  {
    slug: "ace-pro",
    name: "Ace Pro",
    category: "SCV Cargo",
    description: "Compact. Powerful. Perfect for city logistics.",
    price: 599000,
    images: [ace1, ace2, ace3, ace4],
    brochureUrl: "#",
    priceListUrl: "#",
    specs: [
      { key: "Engine", value: "700 cc diesel" },
      { key: "Power", value: "25 kW" },
      { key: "Payload", value: "750 kg" },
      { key: "Mileage", value: "22 km/l" },
    ],
    variants: ["Ace Pro STD", "Ace Pro Plus"],
  },
  {
    slug: "intra-v70",
    name: "Intra V70",
    category: "Pickup",
    description: "High payload pickup with comfort and control.",
    price: 899000,
    images: [ace2, ace3, ace4, ace1],
    brochureUrl: "#",
    priceListUrl: "#",
    specs: [
      { key: "Engine", value: "1496 cc diesel" },
      { key: "Power", value: "59 kW" },
      { key: "Payload", value: "1500 kg" },
      { key: "Mileage", value: "19 km/l" },
    ],
    variants: ["V70 STD", "V70 High"],
  },
  {
    slug: "yodha-pickup",
    name: "Yodha Pickup",
    category: "Pickup",
    description: "Go-anywhere capability with dependable performance.",
    price: 1049000,
    images: [ace3, ace4, ace1, ace2],
    brochureUrl: "#",
    priceListUrl: "#",
    specs: [
      { key: "Engine", value: "2200 cc diesel" },
      { key: "Power", value: "73 kW" },
      { key: "Payload", value: "1700 kg" },
      { key: "Mileage", value: "17 km/l" },
    ],
    variants: ["Yodha 4x2", "Yodha 4x4"],
  },
];

export const offers = [
  { title: "₹0 Down Payment", subtitle: "Limited period", expires: "31 Aug 2025" },
  { title: "7.5% ROI", subtitle: "On select models", expires: "15 Sep 2025" },
  { title: "₹10,000 Exchange Bonus", subtitle: "Upgrade today", expires: "30 Sep 2025" },
];

export const videos: { id: string; title: string }[] = [
  { id: "Gx8eYwL5jCU", title: "Dealer Introduction" },
  { id: "5qap5aO4i9A", title: "Customer Testimonial" },
  { id: "hY7m5jjJ9mM", title: "Service Tour" },
  { id: "aqz-KE-bpKQ", title: "Product Walkthrough" },
];
