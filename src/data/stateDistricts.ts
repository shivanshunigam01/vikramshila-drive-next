// src/data/stateDistricts.ts
// Simple mapping of state -> district list.
// Extend this list as you like or replace with a dynamic API call.
export const STATE_DISTRICT_MAP: Record<string, string[]> = {
  Chhattisgarh: ["Raipur", "Bilaspur", "Durg", "Korba", "Raigarh", "Bastar"],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Sagar",
  ],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Durgapur"],
  Delhi: ["New Delhi"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore", "Hubli-Dharwad"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
};

export const getStates = () => Object.keys(STATE_DISTRICT_MAP).sort();

export const getDistricts = (state: string) => STATE_DISTRICT_MAP[state] || [];
