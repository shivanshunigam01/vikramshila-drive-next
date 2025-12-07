import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";
import hero4 from "@/assets/hero-4.webp";
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

// ---------------- Types ----------------
export type Vehicle = {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  heroImage?: string;
  tagline?: string;
  brochureUrl?: string;
  priceListUrl?: string;
  specs: { key: string; value: string }[];
  variants: string[];
  highlights?: { icon: string; title: string; desc: string }[];
  applications?: { image: string; title: string; capacity: string }[];
};

// ---------------- Hero Images ----------------
export const heroImages = [hero1, hero2, hero3, hero4];

// ---------------- Categories ----------------
export const categories = [
  {
    key: "scv-cargo",
    title: "SCV Cargo",
    image: catScv,
    description:
      "Smart city cargo solutions for quick and efficient deliveries.",
    engine: "700–800 cc",
    fuel: "Petrol / Diesel / CNG",
    payload: "600–900 kg",
    gvw: "1.5–2 Ton",
  },
  {
    key: "scv-passenger",
    title: "SCV Passenger",
    image: catBus,
    description: "City passenger carriers like Magic & Winger.",
    engine: "700–1000 cc",
    fuel: "Diesel / CNG",
    payload: "6–12 passengers",
    gvw: "1.6–2.5 Ton",
  },
  {
    key: "pickup",
    title: "Pickup",
    image: catPickup,
    description: "Rugged performance for every terrain and business need.",
    engine: "2000–2500 cc",
    fuel: "Diesel",
    payload: "1–2.5 Ton",
    gvw: "2.8–4.5 Ton",
  },
  {
    key: "lcv",
    title: "LCV",
    image: catLcv,
    description: "Light commercial vehicles built for reliability and mileage.",
    engine: "3000–3500 cc",
    fuel: "Diesel",
    payload: "3–7 Ton",
    gvw: "7.5–12 Ton",
  },
  {
    key: "icv",
    title: "ICV",
    image: catIcv,
    description: "Intermediate CVs with power and payload for growth.",
    engine: "5000–5700 cc",
    fuel: "Diesel",
    payload: "9–18 Ton",
    gvw: "12–18 Ton",
  },
  {
    key: "mcv",
    title: "MCV",
    image: catMcv,
    description: "Medium CVs for long hauls and heavy duty operations.",
    engine: "6700 cc",
    fuel: "Diesel",
    payload: "25–35 Ton",
    gvw: "25–35 Ton",
  },
  {
    key: "winger",
    title: "Winger",
    image: catWinger,
    description: "Comfort-first people mover for city and intercity routes.",
    engine: "2200 cc",
    fuel: "Diesel",
    payload: "9–18 passengers",
    gvw: "3–4 Ton",
  },
  {
    key: "buses-school",
    title: "Buses - School",
    image: catBus,
    description: "Safe and reliable school buses for students.",
    engine: "3700–5000 cc",
    fuel: "Diesel / CNG",
    payload: "30–55 passengers",
    gvw: "8–12 Ton",
  },
  {
    key: "buses-staff",
    title: "Buses - Staff",
    image: catBus,
    description: "Staff transport solutions with comfort and safety.",
    engine: "3700–5000 cc",
    fuel: "Diesel",
    payload: "30–55 passengers",
    gvw: "8–12 Ton",
  },
  {
    key: "buses-luxury",
    title: "Buses - Luxury & Intercity",
    image: catBus,
    description: "Luxury and intercity buses for long routes.",
    engine: "6700 cc",
    fuel: "Diesel",
    payload: "40–55 passengers",
    gvw: "14–18 Ton",
  },
];

// ---------------- Vehicles ----------------
export const vehicles: Vehicle[] = [
  {
    slug: "ace-gold-petrol",
    name: "Ace Gold Petrol",
    category: "SCV Cargo",
    description: "Tata Ace Gold with refined petrol engine for city logistics.",
    price: 599000,
    heroImage: ace1,
    tagline: "Efficient petrol mini truck for urban cargo.",
    images: [ace1, ace2, ace3, ace4],
    brochureUrl: "#",
    priceListUrl: "#",
    specs: [
      { key: "Engine", value: "Petrol" },
      { key: "Payload", value: "750 kg" },
      { key: "Fuel", value: "Petrol" },
      { key: "Mileage", value: "Up to 22 km/l" },
    ],
    variants: ["Standard"],
    highlights: [
      { icon: hero1, title: "High Mileage", desc: "Up to 22 km/l efficiency." },
      { icon: hero2, title: "Strong Build", desc: "Durable chassis & body." },
    ],
  },
  {
    slug: "ace-gold-cng",
    name: "Ace Gold CNG",
    category: "SCV Cargo",
    description: "Efficient CNG option for low running cost.",
    price: 639000,
    images: [ace3, ace4, ace1, ace2],
    specs: [
      { key: "Engine", value: "CNG" },
      { key: "Payload", value: "650 kg" },
      { key: "Fuel", value: "CNG" },
      { key: "Mileage", value: "Excellent" },
    ],
    variants: ["Standard"],
  },
  {
    slug: "ace-ev",
    name: "Ace EV",
    category: "SCV Cargo",
    description: "Zero-emission electric cargo solution.",
    price: 899000,
    images: [hero1, hero2, hero3, hero4],
    specs: [
      { key: "Powertrain", value: "Electric" },
      { key: "Range", value: "Up to 150 km" },
      { key: "Payload", value: "600 kg" },
      { key: "Charging", value: "Fast charge supported" },
    ],
    variants: ["EV"],
  },

  // Intra Series
  {
    slug: "intra-v10",
    name: "Intra V10",
    category: "SCV Cargo",
    description: "Compact performance for city runs.",
    price: 709000,
    images: [ace1, ace2, ace3],
    specs: [{ key: "Fuel", value: "Diesel" }],
    variants: ["V10"],
  },

  {
    name: "Intra V30",
    category: "SCV Cargo",
    description: "Payload and power balanced.",
    price: 769000,
    images: [ace3, ace4, ace1],
    specs: [{ key: "Fuel", value: "Diesel" }],
    variants: ["V30"],
    slug: "",
  },
  {
    slug: "intra-v50",
    name: "Intra V50",
    category: "SCV Cargo",
    description: "Higher payload for growing business.",
    price: 799000,
    images: [ace4, ace1, ace2],
    specs: [{ key: "Fuel", value: "Diesel" }],
    variants: ["V50"],
  },
  {
    slug: "intra-v70",
    name: "Intra V70 (New)",
    category: "SCV Cargo",
    description: "New-gen performance and comfort.",
    price: 899000,
    images: [ace2, ace3, ace4, ace1],
    specs: [{ key: "Fuel", value: "Diesel" }],
    variants: ["V70"],
  },

  // SCV Passenger – Magic
  {
    slug: "magic-express-petrol",
    name: "Magic Express Petrol",
    category: "SCV Passenger",
    description: "Reliable city passenger carrier (Petrol).",
    price: 679000,
    images: [catBus, hero2],
    specs: [{ key: "Fuel", value: "Petrol" }],
    variants: ["Express"],
  },
  {
    slug: "magic-diesel",
    name: "Magic Diesel",
    category: "SCV Passenger",
    description: "Efficient diesel passenger mover.",
    price: 699000,
    images: [catBus, hero3],
    specs: [{ key: "Fuel", value: "Diesel" }],
    variants: ["Magic"],
  },
  {
    slug: "magic-cng",
    name: "Magic CNG",
    category: "SCV Passenger",
    description: "Low running cost CNG option.",
    price: 709000,
    images: [catBus, hero4],
    specs: [{ key: "Fuel", value: "CNG" }],
    variants: ["Magic"],
  },

  // SCV Passenger – Winger
  {
    slug: "winger-9-seater",
    name: "Winger 9-Seater",
    category: "SCV Passenger",
    description: "Comfortable 9-seater people mover.",
    price: 1249000,
    images: [catWinger, hero1],
    specs: [{ key: "Seating", value: "9" }],
    variants: ["9-Seater"],
  },
  {
    slug: "winger-13-seater",
    name: "Winger 13-Seater",
    category: "SCV Passenger",
    description: "Spacious 13-seater variant.",
    price: 1399000,
    images: [catWinger, hero2],
    specs: [{ key: "Seating", value: "13" }],
    variants: ["13-Seater"],
  },
  {
    slug: "winger-15-seater",
    name: "Winger 15-Seater",
    category: "SCV Passenger",
    description: "High-capacity 15-seater.",
    price: 1549000,
    images: [catWinger, hero3],
    specs: [{ key: "Seating", value: "15" }],
    variants: ["15-Seater"],
  },

  // Yodha Pickup
  {
    slug: "yodha-1250kg",
    name: "Yodha 1250 kg",
    category: "Pickup",
    description: "Dependable pickup with 1250 kg payload.",
    price: 1049000,
    images: [hero2, hero3],
    specs: [{ key: "Payload", value: "1250 kg" }],
    variants: ["4x2"],
  },
  {
    slug: "yodha-1500kg",
    name: "Yodha 1500 kg",
    category: "Pickup",
    description: "Higher payload capacity.",
    price: 1099000,
    images: [hero3, hero4],
    specs: [{ key: "Payload", value: "1500 kg" }],
    variants: ["4x2"],
  },
  {
    slug: "yodha-2000kg",
    name: "Yodha 2000 kg",
    category: "Pickup",
    description: "Heavy-duty payload performance.",
    price: 1199000,
    images: [hero4, hero1],
    specs: [{ key: "Payload", value: "2000 kg" }],
    variants: ["4x2", "4x4"],
  },
  {
    slug: "yodha-cng",
    name: "Yodha CNG",
    category: "Pickup",
    description: "CNG variant for lower running costs.",
    price: 1149000,
    images: [hero1, hero2],
    specs: [{ key: "Fuel", value: "CNG" }],
    variants: ["CNG"],
  },

  // LCV – 407 Series & Ultra LCV
  {
    slug: "407-gold-sfc",
    name: "407 Gold SFC",
    category: "LCV",
    description: "Iconic 407 Gold SFC.",
    price: 1399000,
    images: [catLcv, hero2],
    specs: [{ key: "Series", value: "407" }],
    variants: ["SFC"],
  },
  {
    slug: "407-gold-lpt",
    name: "407 Gold LPT",
    category: "LCV",
    description: "Reliable 407 Gold LPT.",
    price: 1449000,
    images: [catLcv, hero3],
    specs: [{ key: "Series", value: "407" }],
    variants: ["LPT"],
  },
  {
    slug: "ultra-t6",
    name: "Ultra T.6",
    category: "LCV",
    description: "Ultra series T.6 for versatile cargo.",
    price: 1699000,
    images: [catLcv, hero4],
    specs: [{ key: "Series", value: "Ultra" }],
    variants: ["T.6"],
  },
  {
    slug: "ultra-t7",
    name: "Ultra T.7",
    category: "LCV",
    description: "Ultra series T.7 for efficiency.",
    price: 1799000,
    images: [catLcv, hero1],
    specs: [{ key: "Series", value: "Ultra" }],
    variants: ["T.7"],
  },

  // ICV – Ultra & LPT
  {
    slug: "ultra-1518",
    name: "Ultra 1518",
    category: "ICV",
    description: "Powerful ICV for diverse needs.",
    price: 2399000,
    images: [catIcv, hero1],
    specs: [{ key: "GVW", value: "15T" }],
    variants: ["1518"],
  },
  {
    slug: "ultra-1412",
    name: "Ultra 1412",
    category: "ICV",
    description: "Balanced performance and economy.",
    price: 2199000,
    images: [catIcv, hero2],
    specs: [{ key: "GVW", value: "14T" }],
    variants: ["1412"],
  },
  {
    slug: "lpt-1109",
    name: "LPT 1109",
    category: "ICV",
    description: "Legendary LPT platform.",
    price: 1999000,
    images: [catIcv, hero3],
    specs: [{ key: "GVW", value: "11T" }],
    variants: ["1109"],
  },
  {
    slug: "lpt-1512",
    name: "LPT 1512",
    category: "ICV",
    description: "Higher capacity LPT 1512.",
    price: 2299000,
    images: [catIcv, hero4],
    specs: [{ key: "GVW", value: "15T" }],
    variants: ["1512"],
  },

  // MCV – LPT & Ultra
  {
    slug: "lpt-1618",
    name: "LPT 1618",
    category: "MCV",
    description: "MCV with strong performance.",
    price: 2599000,
    images: [catMcv, hero2],
    specs: [{ key: "GVW", value: "16T" }],
    variants: ["1618"],
  },
  {
    slug: "ultra-mcv-series",
    name: "Ultra MCV Series",
    category: "MCV",
    description: "Ultra MCV range for long hauls.",
    price: 2799000,
    images: [catMcv, hero3],
    specs: [{ key: "Series", value: "Ultra" }],
    variants: ["MCV"],
  },

  // Winger variants
  {
    slug: "winger-ambulance",
    name: "Winger Ambulance",
    category: "Winger",
    description: "Factory-built ambulance on Winger platform.",
    price: 1899000,
    images: [catWinger, hero4],
    specs: [{ key: "Type", value: "Ambulance" }],
    variants: ["Ambulance"],
  },
  {
    slug: "winger-staff-van",
    name: "Winger Staff Van",
    category: "Winger",
    description: "Comfortable staff transport van.",
    price: 1749000,
    images: [catWinger, hero1],
    specs: [{ key: "Type", value: "Staff Van" }],
    variants: ["Staff Van"],
  },
  {
    slug: "winger-school-van",
    name: "Winger School Van",
    category: "Winger",
    description: "Safe and reliable school van.",
    price: 1699000,
    images: [catWinger, hero2],
    specs: [{ key: "Type", value: "School Van" }],
    variants: ["School Van"],
  },

  // Buses – School
  {
    slug: "starbus-lp-407-school",
    name: "Starbus LP 407 School",
    category: "Buses - School",
    description: "Starbus LP 407 school bus.",
    price: 2099000,
    images: [catBus, hero1],
    specs: [{ key: "Type", value: "School" }],
    variants: ["LP 407"],
  },
  {
    slug: "starbus-lp-709-school",
    name: "Starbus LP 709 School",
    category: "Buses - School",
    description: "Starbus LP 709 school bus.",
    price: 2299000,
    images: [catBus, hero2],
    specs: [{ key: "Type", value: "School" }],
    variants: ["LP 709"],
  },
  {
    slug: "starbus-lp-909-school",
    name: "Starbus LP 909 School",
    category: "Buses - School",
    description: "Starbus LP 909 school bus.",
    price: 2499000,
    images: [catBus, hero3],
    specs: [{ key: "Type", value: "School" }],
    variants: ["LP 909"],
  },

  // Buses – Staff
  {
    slug: "starbus-staff-24-seater",
    name: "Starbus Staff 24-Seater",
    category: "Buses - Staff",
    description: "Staff bus with 24 seats.",
    price: 2199000,
    images: [catBus, hero2],
    specs: [{ key: "Seats", value: "24" }],
    variants: ["Staff 24"],
  },
  {
    slug: "starbus-staff-32-seater",
    name: "Starbus Staff 32-Seater",
    category: "Buses - Staff",
    description: "Staff bus with 32 seats.",
    price: 2399000,
    images: [catBus, hero3],
    specs: [{ key: "Seats", value: "32" }],
    variants: ["Staff 32"],
  },

  // Buses – Luxury & Intercity
  {
    slug: "magna-coach",
    name: "Magna Coach",
    category: "Buses - Luxury & Intercity",
    description: "Premium intercity Magna coach.",
    price: 4599000,
    images: [catBus, hero4],
    specs: [{ key: "Type", value: "Coach" }],
    variants: ["Magna"],
  },
  {
    slug: "starbus-ultra-ac-nonac",
    name: "Starbus Ultra AC/Non-AC",
    category: "Buses - Luxury & Intercity",
    description: "Ultra bus with AC/Non-AC options.",
    price: 3999000,
    images: [catBus, hero1],
    specs: [{ key: "Climate", value: "AC/Non-AC" }],
    variants: ["Ultra"],
  },
];

export const offers = [
  {
    title: "₹0 Down Payment",
    subtitle: "Limited period",
    expires: "31 Aug 2025",
  },
  { title: "7.5% ROI", subtitle: "On select models", expires: "15 Sep 2025" },
  {
    title: "₹10,000 Exchange Bonus",
    subtitle: "Upgrade today",
    expires: "30 Sep 2025",
  },
];

// ---------------- Videos ----------------
// src/data/products.ts
export const videos = [
  {
    id: "qe8_2zsaPIw",
    title: "Tata Motors Commercial Vehicles | Bharat Mobility 2025",
  },
  {
    id: "wkKVoUALgyo",
    title: "Auto Expo 2025: Tata Prima LNG Truck Walkaround",
  },
  {
    id: "N6qYSmtBvQY",
    title: "Tata Intra V70 2024 Walkaround Review",
  },
  {
    id: "aWNvoJ_ONZM",
    title: "2023 New Tata LPT 712 BS6 Phase 2 Truck Review",
  },
  {
    id: "WoiEPd6KJD0",
    title: "TATA launches the Ultimate Lineup of Commercial Pickups",
  },
  {
    id: "Mxic7ja6pSE",
    title: "Review of Tata Motors' Commercial Vehicle After-Sales Services",
  },
];
