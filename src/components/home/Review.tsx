// src/pages/ReviewQuote.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useMemo, useEffect } from "react";
import {
  createLead,
  downloadCibilReport,
  fetchCibil,
} from "@/services/leadService";
import { toast } from "sonner";

/* ---------- Types ---------- */
interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
}
interface FinanceData {
  vehiclePrice: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  tenure: number;
  interestRate: number;
  loanAmount: number;
  estimatedEMI: number;
}
interface LocationState {
  product: Product;
  financeData: FinanceData;
}

type IndiaRegions = {
  states: string[];
  districtsByState: Record<string, string[]>;
};

/* ---------- Inline India Regions (no fetch) ---------- */
const INDIA_REGIONS: IndiaRegions = {
  states: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  districtsByState: {
    "Andhra Pradesh": [
      "Alluri Sitharama Raju",
      "Anakapalli",
      "Anantapur",
      "Annamayya",
      "Bapatla",
      "Chittoor",
      "East Godavari",
      "Eluru",
      "Guntur",
      "Kakinada",
      "Konaseema",
      "Krishna",
      "Kurnool",
      "Manyam",
      "Nandyal",
      "NTR",
      "Palnadu",
      "Prakasam",
      "Srikakulam",
      "Sri Potti Sriramulu Nellore",
      "Tirupati",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
      "YSR Kadapa",
    ],
    "Arunachal Pradesh": [
      "Anjaw",
      "Changlang",
      "Dibang Valley",
      "East Kameng",
      "East Siang",
      "Itanagar Capital Complex",
      "Kra Daadi",
      "Kurung Kumey",
      "Lepa Rada",
      "Lohit",
      "Longding",
      "Lower Dibang Valley",
      "Lower Siang",
      "Lower Subansiri",
      "Namsai",
      "Pakke-Kessang",
      "Papum Pare",
      "Shi Yomi",
      "Siang",
      "Tawang",
      "Tirap",
      "Upper Dibang Valley",
      "Upper Siang",
      "Upper Subansiri",
      "West Kameng",
      "West Siang",
    ],
    Assam: [
      "Baksa",
      "Barpeta",
      "Biswanath",
      "Bongaigaon",
      "Cachar",
      "Charaideo",
      "Chirang",
      "Darrang",
      "Dhemaji",
      "Dhubri",
      "Dibrugarh",
      "Dima Hasao",
      "Goalpara",
      "Golaghat",
      "Hailakandi",
      "Hojai",
      "Jorhat",
      "Kamrup",
      "Kamrup Metropolitan",
      "Karbi Anglong",
      "Karimganj",
      "Kokrajhar",
      "Lakhimpur",
      "Majuli",
      "Morigaon",
      "Nagaon",
      "Nalbari",
      "Sivasagar",
      "Sonitpur",
      "South Salmara-Mankachar",
      "Tinsukia",
      "Udalguri",
      "West Karbi Anglong",
    ],
    Bihar: [
      "Araria",
      "Arwal",
      "Aurangabad",
      "Banka",
      "Begusarai",
      "Bhagalpur",
      "Bhojpur",
      "Buxar",
      "Darbhanga",
      "East Champaran",
      "Gaya",
      "Gopalganj",
      "Jamui",
      "Jehanabad",
      "Kaimur",
      "Katihar",
      "Khagaria",
      "Kishanganj",
      "Lakhisarai",
      "Madhepura",
      "Madhubani",
      "Munger",
      "Muzaffarpur",
      "Nalanda",
      "Nawada",
      "Patna",
      "Purnia",
      "Rohtas",
      "Saharsa",
      "Samastipur",
      "Saran",
      "Sheikhpura",
      "Sheohar",
      "Sitamarhi",
      "Siwan",
      "Supaul",
      "Vaishali",
      "West Champaran",
    ],
    Chhattisgarh: [
      "Balod",
      "Baloda Bazar",
      "Balrampur",
      "Bastar",
      "Bemetara",
      "Bijapur",
      "Bilaspur",
      "Dantewada",
      "Dhamtari",
      "Durg",
      "Gariaband",
      "Gaurela-Pendra-Marwahi",
      "Janjgir–Champa",
      "Jashpur",
      "Kabirdham",
      "Kanker",
      "Kondagaon",
      "Korba",
      "Koriya",
      "Mahasamund",
      "Mungeli",
      "Narayanpur",
      "Raigarh",
      "Raipur",
      "Rajnandgaon",
      "Sukma",
      "Surajpur",
      "Surguja",
    ],
    Goa: ["North Goa", "South Goa"],
    Gujarat: [
      "Ahmedabad",
      "Amreli",
      "Anand",
      "Aravalli",
      "Banaskantha",
      "Bharuch",
      "Bhavnagar",
      "Botad",
      "Chhota Udaipur",
      "Dahod",
      "Dang",
      "Devbhoomi Dwarka",
      "Gandhinagar",
      "Gir Somnath",
      "Jamnagar",
      "Junagadh",
      "Kheda",
      "Kutch",
      "Mahisagar",
      "Mehsana",
      "Morbi",
      "Narmada",
      "Navsari",
      "Panchmahal",
      "Patan",
      "Porbandar",
      "Rajkot",
      "Sabarkantha",
      "Surat",
      "Surendranagar",
      "Tapi",
      "Vadodara",
      "Valsad",
    ],
    Haryana: [
      "Ambala",
      "Bhiwani",
      "Charkhi Dadri",
      "Faridabad",
      "Fatehabad",
      "Gurugram",
      "Hisar",
      "Jhajjar",
      "Jind",
      "Kaithal",
      "Karnal",
      "Kurukshetra",
      "Mahendragarh",
      "Nuh",
      "Palwal",
      "Panchkula",
      "Panipat",
      "Rewari",
      "Rohtak",
      "Sirsa",
      "Sonipat",
      "Yamunanagar",
    ],
    "Himachal Pradesh": [
      "Bilaspur",
      "Chamba",
      "Hamirpur",
      "Kangra",
      "Kinnaur",
      "Kullu",
      "Lahaul and Spiti",
      "Mandi",
      "Shimla",
      "Sirmaur",
      "Solan",
      "Una",
    ],
    Jharkhand: [
      "Bokaro",
      "Chatra",
      "Deoghar",
      "Dhanbad",
      "Dumka",
      "East Singhbhum",
      "Garhwa",
      "Giridih",
      "Godda",
      "Gumla",
      "Hazaribagh",
      "Jamtara",
      "Khunti",
      "Koderma",
      "Latehar",
      "Lohardaga",
      "Pakur",
      "Palamu",
      "Ramgarh",
      "Ranchi",
      "Sahibganj",
      "Seraikela-Kharsawan",
      "Simdega",
      "West Singhbhum",
    ],
    Karnataka: [
      "Bagalkote",
      "Bangalore Rural",
      "Bengaluru Urban",
      "Belagavi",
      "Ballari",
      "Bidar",
      "Chamarajanagara",
      "Chikkaballapura",
      "Chikkamagaluru",
      "Chitradurga",
      "Dakshina Kannada",
      "Davanagere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kalaburagi",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Raichur",
      "Ramanagara",
      "Shivamogga",
      "Tumakuru",
      "Udupi",
      "Uttara Kannada",
      "Vijayanagara",
      "Vijayapura",
      "Yadgir",
    ],
    Kerala: [
      "Alappuzha",
      "Ernakulam",
      "Idukki",
      "Kannur",
      "Kasaragod",
      "Kollam",
      "Kottayam",
      "Kozhikode",
      "Malappuram",
      "Palakkad",
      "Pathanamthitta",
      "Thiruvananthapuram",
      "Thrissur",
      "Wayanad",
    ],
    "Madhya Pradesh": [
      "Agar Malwa",
      "Alirajpur",
      "Anuppur",
      "Ashoknagar",
      "Balaghat",
      "Barwani",
      "Betul",
      "Bhind",
      "Bhopal",
      "Burhanpur",
      "Chhatarpur",
      "Chhindwara",
      "Damoh",
      "Datia",
      "Dewas",
      "Dhar",
      "Dindori",
      "Guna",
      "Gwalior",
      "Harda",
      "Hoshangabad",
      "Indore",
      "Jabalpur",
      "Jhabua",
      "Katni",
      "Khandwa",
      "Khargone",
      "Mandla",
      "Mandsaur",
      "Morena",
      "Narsinghpur",
      "Neemuch",
      "Niwari",
      "Panna",
      "Raisen",
      "Rajgarh",
      "Ratlam",
      "Rewa",
      "Sagar",
      "Satna",
      "Sehore",
      "Seoni",
      "Shahdol",
      "Shajapur",
      "Sheopur",
      "Shivpuri",
      "Sidhi",
      "Singrauli",
      "Tikamgarh",
      "Ujjain",
      "Umaria",
      "Vidisha",
    ],
    Maharashtra: [
      "Ahmednagar",
      "Akola",
      "Amravati",
      "Aurangabad",
      "Beed",
      "Bhandara",
      "Buldhana",
      "Chandrapur",
      "Dhule",
      "Gadchiroli",
      "Gondia",
      "Hingoli",
      "Jalgaon",
      "Jalna",
      "Kolhapur",
      "Latur",
      "Mumbai",
      "Mumbai Suburban",
      "Nagpur",
      "Nanded",
      "Nandurbar",
      "Nashik",
      "Osmanabad",
      "Palghar",
      "Parbhani",
      "Pune",
      "Raigad",
      "Ratnagiri",
      "Sangli",
      "Satara",
      "Sindhudurg",
      "Solapur",
      "Thane",
      "Wardha",
      "Washim",
      "Yavatmal",
    ],
    Manipur: [
      "Bishnupur",
      "Chandel",
      "Churachandpur",
      "Imphal East",
      "Imphal West",
      "Jiribam",
      "Kakching",
      "Kamjong",
      "Kangpokpi",
      "Noney",
      "Pherzawl",
      "Senapati",
      "Tamenglong",
      "Tengnoupal",
      "Thoubal",
      "Ukhrul",
    ],
    Meghalaya: [
      "East Garo Hills",
      "East Jaintia Hills",
      "East Khasi Hills",
      "Eastern West Khasi Hills",
      "North Garo Hills",
      "Ribhoi",
      "South Garo Hills",
      "South West Garo Hills",
      "South West Khasi Hills",
      "West Garo Hills",
      "West Jaintia Hills",
      "West Khasi Hills",
    ],
    Mizoram: [
      "Aizawl",
      "Champhai",
      "Hnahthial",
      "Khawzawl",
      "Kolasib",
      "Lawngtlai",
      "Lunglei",
      "Mamit",
      "Saiha",
      "Saitual",
      "Serchhip",
    ],
    Nagaland: [
      "Chumoukedima",
      "Dimapur",
      "Kiphire",
      "Kohima",
      "Longleng",
      "Mokokchung",
      "Mon",
      "Niuland",
      "Noklak",
      "Peren",
      "Phek",
      "Tuensang",
      "Tseminyu",
      "Wokha",
      "Zunheboto",
    ],
    Odisha: [
      "Angul",
      "Balangir",
      "Baleswar",
      "Bargarh",
      "Bhadrak",
      "Boudh",
      "Cuttack",
      "Deogarh",
      "Dhenkanal",
      "Gajapati",
      "Ganjam",
      "Jagatsinghpur",
      "Jajpur",
      "Jharsuguda",
      "Kalahandi",
      "Kandhamal",
      "Kendrapara",
      "Kendujhar",
      "Khordha",
      "Koraput",
      "Malkangiri",
      "Mayurbhanj",
      "Nabarangpur",
      "Nayagarh",
      "Nuapada",
      "Puri",
      "Rayagada",
      "Sambalpur",
      "Subarnapur",
      "Sundargarh",
    ],
    Punjab: [
      "Amritsar",
      "Barnala",
      "Bathinda",
      "Faridkot",
      "Fatehgarh Sahib",
      "Fazilka",
      "Ferozepur",
      "Gurdaspur",
      "Hoshiarpur",
      "Jalandhar",
      "Kapurthala",
      "Ludhiana",
      "Mansa",
      "Moga",
      "Pathankot",
      "Patiala",
      "Rupnagar",
      "Sahibzada Ajit Singh Nagar",
      "Sangrur",
      "Shaheed Bhagat Singh Nagar",
      "Sri Muktsar Sahib",
      "Tarn Taran",
    ],
    Rajasthan: [
      "Ajmer",
      "Alwar",
      "Banswara",
      "Baran",
      "Barmer",
      "Bharatpur",
      "Bhilwara",
      "Bikaner",
      "Bundi",
      "Chittorgarh",
      "Churu",
      "Dausa",
      "Dholpur",
      "Dungarpur",
      "Hanumangarh",
      "Jaipur",
      "Jaisalmer",
      "Jalore",
      "Jhalawar",
      "Jhunjhunu",
      "Jodhpur",
      "Karauli",
      "Kota",
      "Nagaur",
      "Pali",
      "Pratapgarh",
      "Rajsamand",
      "Sawai Madhopur",
      "Sikar",
      "Sirohi",
      "Sri Ganganagar",
      "Tonk",
      "Udaipur",
    ],
    Sikkim: ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"],
    "Tamil Nadu": [
      "Ariyalur",
      "Chengalpattu",
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kallakurichi",
      "Kancheepuram",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Mayiladuthurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Ranipet",
      "Salem",
      "Sivagangai",
      "Tenkasi",
      "Thanjavur",
      "Theni",
      "Thiruvallur",
      "Thiruvarur",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tirupathur",
      "Tiruppur",
      "Tiruvannamalai",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],
    Telangana: [
      "Adilabad",
      "Bhadradri Kothagudem",
      "Hanumakonda",
      "Hyderabad",
      "Jagtial",
      "Jangaon",
      "Jayashankar Bhupalpally",
      "Jogulamba Gadwal",
      "Kamareddy",
      "Karimnagar",
      "Khammam",
      "Komaram Bheem Asifabad",
      "Mahabubabad",
      "Mahabubnagar",
      "Mancherial",
      "Medak",
      "Medchal–Malkajgiri",
      "Mulugu",
      "Nagarkurnool",
      "Nalgonda",
      "Narayanpet",
      "Nirmal",
      "Nizamabad",
      "Peddapalli",
      "Rajanna Sircilla",
      "Ranga Reddy",
      "Sangareddy",
      "Siddipet",
      "Suryapet",
      "Vikarabad",
      "Wanaparthy",
      "Warangal",
      "Yadadri Bhuvanagiri",
    ],
    Tripura: [
      "Dhalai",
      "Gomati",
      "Khowai",
      "North Tripura",
      "Sepahijala",
      "South Tripura",
      "Unakoti",
      "West Tripura",
    ],
    "Uttar Pradesh": [
      "Agra",
      "Aligarh",
      "Ambedkar Nagar",
      "Amethi",
      "Amroha",
      "Auraiya",
      "Ayodhya",
      "Azamgarh",
      "Badaun",
      "Baghpat",
      "Bahraich",
      "Ballia",
      "Balrampur",
      "Banda",
      "Barabanki",
      "Bareilly",
      "Basti",
      "Bhadohi",
      "Bijnor",
      "Bulandshahr",
      "Chandauli",
      "Chitrakoot",
      "Deoria",
      "Etah",
      "Etawah",
      "Farrukhabad",
      "Fatehpur",
      "Firozabad",
      "Gautam Buddha Nagar",
      "Ghaziabad",
      "Ghazipur",
      "Gonda",
      "Gorakhpur",
      "Hamirpur",
      "Hapur",
      "Hardoi",
      "Hathras",
      "Jalaun",
      "Jaunpur",
      "Jhansi",
      "Kannauj",
      "Kanpur Dehat",
      "Kanpur Nagar",
      "Kasganj",
      "Kaushambi",
      "Kheri",
      "Kushinagar",
      "Lalitpur",
      "Lucknow",
      "Maharajganj",
      "Mahoba",
      "Mainpuri",
      "Mathura",
      "Mau",
      "Meerut",
      "Mirzapur",
      "Moradabad",
      "Muzaffarnagar",
      "Pilibhit",
      "Pratapgarh",
      "Prayagraj",
      "Raebareli",
      "Rampur",
      "Saharanpur",
      "Sambhal",
      "Sant Kabir Nagar",
      "Shahjahanpur",
      "Shamli",
      "Shravasti",
      "Siddharthnagar",
      "Sitapur",
      "Sonbhadra",
      "Sultanpur",
      "Unnao",
      "Varanasi",
    ],
    Uttarakhand: [
      "Almora",
      "Bageshwar",
      "Chamoli",
      "Champawat",
      "Dehradun",
      "Haridwar",
      "Nainital",
      "Pauri Garhwal",
      "Pithoragarh",
      "Rudraprayag",
      "Tehri Garhwal",
      "Udham Singh Nagar",
      "Uttarkashi",
    ],
    "West Bengal": [
      "Alipurduar",
      "Bankura",
      "Birbhum",
      "Cooch Behar",
      "Dakshin Dinajpur",
      "Darjeeling",
      "Hooghly",
      "Howrah",
      "Jalpaiguri",
      "Jhargram",
      "Kalimpong",
      "Kolkata",
      "Murshidabad",
      "Nadia",
      "North 24 Parganas",
      "Paschim Bardhaman",
      "Paschim Medinipur",
      "Purba Bardhaman",
      "Purba Medinipur",
      "Purulia",
      "South 24 Parganas",
      "Uttar Dinajpur",
    ],
    "Andaman and Nicobar Islands": [
      "Nicobar",
      "North and Middle Andaman",
      "South Andaman",
    ],
    Chandigarh: ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": [
      "Dadra & Nagar Haveli",
      "Daman",
      "Diu",
    ],
    Delhi: [
      "Central Delhi",
      "East Delhi",
      "New Delhi",
      "North Delhi",
      "North East Delhi",
      "North West Delhi",
      "Shahdara",
      "South Delhi",
      "South East Delhi",
      "South West Delhi",
      "West Delhi",
    ],
    "Jammu and Kashmir": [
      "Anantnag",
      "Bandipora",
      "Baramulla",
      "Budgam",
      "Doda",
      "Ganderbal",
      "Jammu",
      "Kathua",
      "Kishtwar",
      "Kulgam",
      "Kupwara",
      "Poonch",
      "Pulwama",
      "Rajouri",
      "Ramban",
      "Reasi",
      "Samba",
      "Shopian",
      "Srinagar",
      "Udhampur",
    ],
    Ladakh: ["Kargil", "Leh"],
    Lakshadweep: ["Lakshadweep"],
    Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  },
};

/* ---------- Helpers ---------- */
const norm = (s: string) =>
  (s || "")
    .normalize("NFKC")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// helpful if something pre-fills a short code like "mp"
const STATE_ALIASES: Record<string, string> = {
  ap: "Andhra Pradesh",
  ar: "Arunachal Pradesh",
  as: "Assam",
  br: "Bihar",
  cg: "Chhattisgarh",
  ch: "Chandigarh",
  dd: "Dadra and Nagar Haveli and Daman and Diu",
  dn: "Dadra and Nagar Haveli and Daman and Diu",
  dl: "Delhi",
  ga: "Goa",
  gj: "Gujarat",
  hr: "Haryana",
  hp: "Himachal Pradesh",
  jk: "Jammu and Kashmir",
  jh: "Jharkhand",
  ka: "Karnataka",
  kl: "Kerala",
  la: "Ladakh",
  ld: "Lakshadweep",
  mp: "Madhya Pradesh",
  mh: "Maharashtra",
  mn: "Manipur",
  ml: "Meghalaya",
  mz: "Mizoram",
  nl: "Nagaland",
  od: "Odisha",
  or: "Odisha",
  pb: "Punjab",
  py: "Puducherry",
  rj: "Rajasthan",
  sk: "Sikkim",
  tn: "Tamil Nadu",
  tg: "Telangana",
  tr: "Tripura",
  uk: "Uttarakhand",
  ut: "Uttarakhand",
  up: "Uttar Pradesh",
  wb: "West Bengal",
};
const resolveStateLabel = (value: string, states: string[]) => {
  const aliased = STATE_ALIASES[norm(value)] || value;
  const hit = states.find((s) => norm(s) === norm(aliased));
  return hit || aliased;
};

/* ---------- Utils ---------- */
function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
const MAX_KYC_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const onlyDigits = (s: string) => s.replace(/\D+/g, "");
const emailOK = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
function validateImage(file: File | null | undefined, docLabel: string) {
  if (!file) return true;
  if (!ALLOWED_MIME.includes(file.type)) {
    toast.error(`${docLabel}: Only images are allowed (JPG/PNG/WEBP/AVIF).`);
    return false;
  }
  if (file.size > MAX_KYC_SIZE) {
    toast.error(`${docLabel}: File too large (max 10MB).`);
    return false;
  }
  return true;
}

/* ---------- Static Options ---------- */
const SOURCE_OPTIONS = [
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Google Ads",
  "Website",
  "Referral",
  "Roadshow",
  "Launch",
  "DSE Visit",
  "YouTube",
  "Other",
];
const DSE_OPTIONS = [
  { id: "dse_001", name: "Amit Kumar" },
  { id: "dse_002", name: "Pooja Singh" },
  { id: "dse_003", name: "Ravi Raj" },
];

export default function ReviewQuote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // KYC
  const [fullNameForCibil, setFullNameForCibil] = useState("");
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panCardFile, setPanCardFile] = useState<File | null>(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cibilScore, setCibilScore] = useState<number | null>(null);
  const [cibilResponse, setCibilResponse] = useState<any>(null);
  const [cibilStatus, setCibilStatus] = useState<string | null>(null);
  const [isFetchingCibil, setIsFetchingCibil] = useState(false);
  const [kycConsent, setKycConsent] = useState(false);

  // Applicant (optional)
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [financeCustomerName, setFinanceCustomerName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [selectedState, setSelectedState] = useState<string>(""); // store raw value
  const [district, setDistrict] = useState("");
  const [pin, setPin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [applicantType, setApplicantType] = useState<"individual" | "company">(
    "individual"
  );
  const [companyGST, setCompanyGST] = useState("");
  const [companyPAN, setCompanyPAN] = useState("");
  const [sourceOfEnquiry, setSourceOfEnquiry] = useState<string>("");
  const [dseId, setDseId] = useState<string>("");
  const [dseName, setDseName] = useState<string>("");

  // Options derived from inline JSON
  const statesList = useMemo(
    () => [...INDIA_REGIONS.states].sort((a, b) => a.localeCompare(b)),
    []
  );
  const districtOptions = useMemo(() => {
    if (!selectedState) return [];
    const label = resolveStateLabel(selectedState, statesList);
    return INDIA_REGIONS.districtsByState[label] || [];
  }, [selectedState, statesList]);

  const pinValid = useMemo(() => /^\d{6}$/.test(onlyDigits(pin)), [pin]);

  const state = location.state as LocationState;

  useEffect(() => {
    const found = DSE_OPTIONS.find((d) => d.id === dseId);
    if (found) setDseName(found.name);
  }, [dseId]);

  // reset district when state changes
  useEffect(() => {
    setDistrict("");
  }, [selectedState]);

  if (!state || !state.product || !state.financeData) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">No Quote Data Found</h1>
          <p className="text-gray-400 mb-6">
            Please select a product and configure finance options first.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { product, financeData } = state;

  const onAadharChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!validateImage(file, "Aadhaar")) {
      e.target.value = "";
      setAadharFile(null);
      return;
    }
    setAadharFile(file);
  };
  const onPanChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!validateImage(file, "PAN")) {
      e.target.value = "";
      setPanCardFile(null);
      return;
    }
    setPanCardFile(file);
  };

  const totalPayable = useMemo(
    () =>
      financeData.downPaymentAmount +
      financeData.estimatedEMI * financeData.tenure,
    [financeData]
  );
  const totalInterest = useMemo(
    () =>
      financeData.estimatedEMI * financeData.tenure - financeData.loanAmount,
    [financeData]
  );
  const loggedInUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }, []);

  const validateNumbers = () => {
    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
      toast.error("Aadhaar number must be 12 digits.");
      return false;
    }
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      toast.error("PAN must be 10 characters (e.g., ABCDE1234F).");
      return false;
    }
    if (pin && !/^\d{6}$/.test(onlyDigits(pin))) {
      toast.error("PIN must be 6 digits.");
      return false;
    }
    return true;
  };

  const kycProvided =
    !!aadharNumber ||
    !!panNumber ||
    !!aadharFile ||
    !!panCardFile ||
    !!(phoneNumber && panNumber);

  const doSubmit = async () => {
    if (!validateNumbers()) return;
    if (phoneNumber && !/^\d{10}$/.test(onlyDigits(phoneNumber))) {
      toast.error("Phone number must be 10 digits.");
      return;
    }
    if (kycProvided && !kycConsent) {
      toast.error("Please provide consent for KYC/CIBIL before submitting.");
      return;
    }

    const applicantFilled =
      financeCustomerName ||
      addressLine ||
      selectedState ||
      district ||
      pin ||
      whatsapp ||
      email ||
      dseId ||
      sourceOfEnquiry ||
      companyGST ||
      companyPAN;

    if (applicantFilled) {
      if (!selectedState) {
        toast.error("Please select State in Applicant Details.");
        return;
      }
      if (!district) {
        toast.error("Please select District in Applicant Details.");
        return;
      }
      if (!/^\d{6}$/.test(onlyDigits(pin))) {
        toast.error("PIN must be 6 digits.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (aadharFile && !validateImage(aadharFile, "Aadhaar")) return;
      if (panCardFile && !validateImage(panCardFile, "PAN")) return;

      const form = new FormData();

      // Product
      form.append("productId", product._id);
      form.append("productTitle", product.title);
      form.append("productCategory", product.category || "");

      // Finance
      form.append("vehiclePrice", String(financeData.vehiclePrice));
      form.append("downPaymentAmount", String(financeData.downPaymentAmount));
      form.append(
        "downPaymentPercentage",
        String(financeData.downPaymentPercentage)
      );
      form.append("loanAmount", String(financeData.loanAmount));
      form.append("interestRate", String(financeData.interestRate));
      form.append("tenure", String(financeData.tenure));
      form.append("estimatedEMI", String(financeData.estimatedEMI));

      // Lead status
      form.append("status", "pending");

      // User (if present)
      if (userData?.id) form.append("userId", userData.id);
      if (userData?.name) form.append("userName", userData.name);
      if (userData?.email) form.append("userEmail", userData.email);
      if (userData?.phone) form.append("userPhone", userData.phone);

      // Applicant Details (optional)
      const appendIf = (key: string, val?: string) => {
        if (val && String(val).trim() !== "")
          form.append(key, String(val).trim());
      };

      appendIf("financeCustomerName", financeCustomerName);
      appendIf("addressLine", addressLine);

      const stateLabel = selectedState
        ? resolveStateLabel(selectedState, statesList)
        : "";
      appendIf("state", stateLabel);
      appendIf("district", district);
      appendIf("pin", onlyDigits(pin));
      appendIf("whatsapp", onlyDigits(whatsapp));
      if (email && emailOK(email)) appendIf("email", email);
      appendIf("applicantType", applicantType);
      if (applicantType === "company") {
        appendIf("companyGST", companyGST.toUpperCase());
        appendIf("companyPAN", companyPAN.toUpperCase());
      }
      appendIf("sourceOfEnquiry", sourceOfEnquiry);
      appendIf("dseId", dseId);
      appendIf("dseName", dseName);

      // KYC
      appendIf("aadharNumber", onlyDigits(aadharNumber));
      appendIf("panNumber", panNumber.toUpperCase());
      appendIf("kycPhone", onlyDigits(phoneNumber));
      if (aadharFile) form.append("aadharFile", aadharFile);
      if (panCardFile) form.append("panCardFile", panCardFile);

      form.append("kycProvided", kycProvided ? "true" : "false");
      form.append(
        "kycFields",
        JSON.stringify({
          aadharNumber: !!aadharNumber,
          panNumber: !!panNumber,
          aadharFile: !!aadharFile,
          panCardFile: !!panCardFile,
          phoneForCibil: !!phoneNumber,
        })
      );
      form.append(
        "kycConsent",
        kycProvided ? (kycConsent ? "true" : "false") : "false"
      );

      if (cibilScore !== null) form.append("cibilScore", String(cibilScore));
      if (cibilStatus) form.append("cibilStatus", cibilStatus);
      appendIf("fullNameForCibil", fullNameForCibil);

      form.append("creditChargeINR", "75");
      form.append("creditProvider", "surepass-experian");

      const result = await createLead(form);

      if (result?.success) {
        toast.success("Request submitted successfully!");
        navigate("/thank-you");
      } else {
        toast.error(
          result?.message || "Failed to submit quote. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast.error("Failed to submit quote. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowApplicantModal(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>Review Quote | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Review your vehicle quote before submission."
        />
      </Helmet>

      <Header />

      {/* Breadcrumb */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-400">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <span className="mx-2">›</span>
            <a href="/products" className="hover:text-white">
              Products
            </a>
            <span className="mx-2">›</span>
            <span className="text-white">Review Quote</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Review Your Quote
            </h1>
            <p className="text-gray-400">
              Please review all details before submitting your quote
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Card */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Selected Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.images?.[0] && (
                  <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium text-white">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Vehicle Price</p>
                      <p className="font-medium text-white">{product.price}</p>
                    </div>
                  </div>
                  {product.brochureFile && (
                    <div className="pt-3">
                      <a
                        href={product.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        View Brochure (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Finance Card */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Finance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Vehicle Price</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.vehiclePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Down Payment</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.downPaymentAmount)} (
                      {financeData.downPaymentPercentage}%)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Loan Amount</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tenure</p>
                    <p className="font-medium text-white">
                      {financeData.tenure} months
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Interest Rate</p>
                    <p className="font-medium text-white">
                      {financeData.interestRate}% p.a.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estimated EMI</p>
                    <p className="text-xl font-bold text-blue-400">
                      {formatINR(financeData.estimatedEMI)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Payment Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Total Amount Payable:
                        </span>
                        <span className="text-white font-medium">
                          {formatINR(totalPayable)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Interest:</span>
                        <span className="text-white font-medium">
                          {formatINR(totalInterest)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KYC (Optional) */}
          <Card className="bg-gray-900 border border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                KYC (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name for CIBIL */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-2">
                    Customer Full Name (as per PAN)
                  </p>
                  <input
                    type="text"
                    value={fullNameForCibil}
                    onChange={(e) => setFullNameForCibil(e.target.value)}
                    placeholder="e.g., Vishal Rathore"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Aadhaar Number</p>
                  <input
                    type="text"
                    value={aadharNumber}
                    onChange={(e) =>
                      setAadharNumber(onlyDigits(e.target.value).slice(0, 12))
                    }
                    placeholder="Enter 12-digit Aadhaar"
                    inputMode="numeric"
                    maxLength={12}
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">PAN Number</p>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) =>
                      setPanNumber(e.target.value.toUpperCase().slice(0, 10))
                    }
                    placeholder="Enter PAN (ABCDE1234F)"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Phone Number</p>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(onlyDigits(e.target.value).slice(0, 10))
                    }
                    placeholder="Enter 10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
              </div>

              {/* Files */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Aadhaar (JPG/PNG/WEBP/AVIF)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAadharChange}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {aadharFile && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                      <span>{aadharFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setAadharFile(null)}
                        className="underline decoration-dotted hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    PAN (JPG/PNG/WEBP/AVIF)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPanChange}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {panCardFile && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                      <span>{panCardFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setPanCardFile(null)}
                        className="underline decoration-dotted hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="mt-2">
                <label className="flex items-start gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    className="mt-1 accent-blue-600"
                    checked={kycConsent}
                    onChange={(e) => setKycConsent(e.target.checked)}
                  />
                  <span>
                    I consent to share my KYC details and authorize a soft
                    credit bureau pull. A nominal charge of <b>₹75</b> may
                    apply.
                    <span className="block text-xs text-gray-500 mt-1">
                      (Required only if you’ve entered KYC or will fetch CIBIL.)
                    </span>
                  </span>
                </label>
              </div>

              <p className="text-xs text-gray-500">
                All KYC fields are optional. You can also share these later with
                our team.
              </p>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="bg-yellow-900/20 border border-yellow-600/30 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-yellow-400 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-gray-300">
                This is an estimated quote based on the information provided.
                Final terms may vary based on documentation, credit approval,
                and bank policies. Our team will contact you shortly to finalize
                your application.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 mt-8 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="px-8 py-3 bg-white text-black border border-gray-300 hover:bg-gray-200"
            >
              Go Back
            </Button>

            {/* Fetch CIBIL Score */}
            <Button
              onClick={async () => {
                if (!fullNameForCibil.trim()) {
                  toast.error("Please enter full name (as per PAN).");
                  return;
                }
                if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
                  toast.error("Please enter a valid 10-digit mobile.");
                  return;
                }
                if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(panNumber)) {
                  toast.error("Please enter a valid PAN (ABCDE1234F).");
                  return;
                }
                if (!kycConsent) {
                  toast.error(
                    "Please consent to KYC/CIBIL to fetch the score."
                  );
                  return;
                }

                setIsFetchingCibil(true);
                try {
                  const resp = await fetchCibil({
                    name: fullNameForCibil.trim(),
                    consent: "Y",
                    mobile: phoneNumber,
                    pan: panNumber.toUpperCase(),
                  });
                  setCibilScore(resp.score);
                  setCibilStatus(resp.ok ? "success" : "failed");
                  setCibilResponse(resp);
                } catch (e: any) {
                  toast.error(e?.message || "Failed to fetch CIBIL score.");
                  setCibilStatus("failed");
                } finally {
                  setIsFetchingCibil(false);
                }
              }}
              disabled={isFetchingCibil}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isFetchingCibil ? "Fetching..." : "Fetch CIBIL Score"}
            </Button>

            <Button
              onClick={() => setShowApplicantModal(true)}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>

          {(isFetchingCibil || cibilScore !== null) && (
            <Card className="bg-gray-900 border border-gray-800 mt-8 text-center">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">CIBIL Check</h3>
                {isFetchingCibil ? (
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Fetching your CIBIL score...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-blue-400">
                      CIBIL Score: {cibilScore ?? "—"}
                    </p>
                    <p className="text-sm text-gray-300">
                      Status: {cibilStatus ?? "—"}
                    </p>
                  </div>
                )}
                <Button
                  onClick={async () => {
                    if (isDownloading) return; // guard
                    setIsDownloading(true);
                    try {
                      await downloadCibilReport({
                        name: fullNameForCibil.trim(),
                        consent: "Y",
                        mobile: phoneNumber,
                        pan: panNumber.toUpperCase(),
                      });
                      toast.success("CIBIL Report Downloaded Sucessfully!");
                    } catch (err: any) {
                      toast.error(
                        err?.message || "Failed to open CIBIL Report."
                      );
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {isDownloading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                      Downloading…
                    </span>
                  ) : (
                    "Download CIBIL Report (PDF)"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <div className="text-center mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-3">
              Have questions about this quote? Our team is here to help.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <p className="text-gray-400">Call us:</p>
                <p className="text-blue-400 font-medium">+91 8406991610</p>
              </div>
              <div>
                <p className="text-gray-400">Email us:</p>
                <p className="text-blue-400 font-medium">
                  info@vikramshila.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Applicant Details */}
      {showApplicantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowApplicantModal(false)}
          />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-950 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Applicant Details (Optional)
              </h3>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowApplicantModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Customer Name (For Finance)
                  </p>
                  <input
                    type="text"
                    value={financeCustomerName}
                    onChange={(e) => setFinanceCustomerName(e.target.value)}
                    placeholder="Full name as per KYC"
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Applicant Type</p>
                  <select
                    value={applicantType}
                    onChange={(e) =>
                      setApplicantType(
                        e.target.value as "individual" | "company"
                      )
                    }
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>

              {applicantType === "company" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">GSTIN</p>
                    <input
                      type="text"
                      value={companyGST}
                      onChange={(e) =>
                        setCompanyGST(e.target.value.toUpperCase().slice(0, 15))
                      }
                      placeholder="15-character GSTIN"
                      className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Company PAN</p>
                    <input
                      type="text"
                      value={companyPAN}
                      onChange={(e) =>
                        setCompanyPAN(e.target.value.toUpperCase().slice(0, 10))
                      }
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                      maxLength={10}
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-2">Address</p>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House/Street/Area"
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    State <span className="text-red-500">*</span>
                  </p>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value); // store label directly
                      setDistrict("");
                    }}
                    className={`w-full px-3 py-2 rounded bg-gray-900 border text-white text-sm ${
                      selectedState ? "border-gray-700" : "border-red-600"
                    }`}
                  >
                    <option value="">Select State</option>
                    {statesList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {!selectedState && (
                    <p className="mt-1 text-xs text-red-400">
                      State is required.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    District <span className="text-red-500">*</span>
                  </p>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!selectedState}
                    className={`w-full px-3 py-2 rounded bg-gray-900 border text-white text-sm ${
                      district ? "border-gray-700" : "border-red-600"
                    } ${!selectedState ? "opacity-60" : ""}`}
                  >
                    <option value="">
                      {selectedState ? "Select District" : "Select State first"}
                    </option>
                    {districtOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {!district && selectedState && (
                    <p className="mt-1 text-xs text-red-400">
                      District is required.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">PIN</p>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) =>
                      setPin(onlyDigits(e.target.value).slice(0, 6))
                    }
                    placeholder="6-digit PIN"
                    inputMode="numeric"
                    maxLength={6}
                    className={`w-full px-3 py-2 rounded bg-gray-900 border text-white text-sm ${
                      pin
                        ? pinValid
                          ? "border-gray-700"
                          : "border-red-600"
                        : "border-gray-700"
                    }`}
                  />
                  {!pinValid && pin.length > 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      PIN must be 6 digits.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">WhatsApp</p>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) =>
                      setWhatsapp(onlyDigits(e.target.value).slice(0, 10))
                    }
                    placeholder="10-digit number"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-2">
                    Mail ID (optional)
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Source of Enquiry
                  </p>
                  <select
                    value={sourceOfEnquiry}
                    onChange={(e) => setSourceOfEnquiry(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  >
                    <option value="">Select source (optional)</option>
                    {SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DSE Selection: only when Source is "DSE Visit" */}
                {sourceOfEnquiry === "DSE Visit" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">DSE Selection</p>
                    <select
                      value={dseId}
                      onChange={(e) => setDseId(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                    >
                      <option value="">Select DSE</option>
                      {DSE_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-200"
                onClick={doSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Skip & Submit"}
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-800"
                  onClick={() => setShowApplicantModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={doSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
