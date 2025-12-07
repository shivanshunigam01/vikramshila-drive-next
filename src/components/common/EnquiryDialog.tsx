"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { sendEnquiryService } from "@/services/enquiry.service";
import { Textarea } from "../ui/textarea";

let externalOpen: (() => void) | null = null;

export function openEnquiryDialog(title: any) {
  if (externalOpen) externalOpen();
}

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

// If you want type safety (optional, same as in ReviewQuote):
type IndiaRegions = {
  states: string[];
  districtsByState: Record<string, string[]>;
};

// Normalizer (same as norm in ReviewQuote)
const norm = (s: string) =>
  (s || "")
    .normalize("NFKC")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// State aliases (short codes → full names)
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

// Resolve state label exactly like ReviewQuote
const resolveStateLabel = (value: string, states: string[]) => {
  const aliased = STATE_ALIASES[norm(value)] || value;
  const hit = states.find((s) => norm(s) === norm(aliased));
  return hit || aliased;
};

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  mobile: z.string().regex(/^\d{10}$/g, "Enter a valid 10-digit mobile number"),
  state: z.string().min(2, "Select your state"),
  district: z.string().min(2, "Select your district"),
  pincode: z.string().regex(/^\d{6}$/g, "Enter a valid 6-digit pincode"),
  briefDescription: z.string().min(5, "Please add a brief description"),
  consentCall: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  consentWhatsApp: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});

export default function EnquiryDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  externalOpen = () => setOpen(true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      mobile: "",
      state: "",
      district: "",
      pincode: "",
      briefDescription: "",
      consentCall: true,
      consentWhatsApp: true,
    },
  });

  // List of states (sorted) from INDIA_REGIONS
  const statesList = (INDIA_REGIONS?.states || [])
    .slice()
    .sort((a, b) => a.localeCompare(b));

  const selectedState = form.watch("state");

  const districtOptions =
    selectedState && INDIA_REGIONS?.districtsByState
      ? INDIA_REGIONS.districtsByState[
          resolveStateLabel(selectedState, statesList)
        ] || []
      : [];

  // Reset district when state changes
  useEffect(() => {
    form.setValue("district", "");
  }, [selectedState, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const response = await sendEnquiryService({
        fullName: values.name,
        mobileNumber: values.mobile,
        state: values.state,
        district: values.district,
        pincode: values.pincode,
        briefDescription: values.briefDescription,
        whatsappConsent: values.consentWhatsApp,
      });

      if (response.data.success) {
        form.reset();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setOpen(false);
        }, 3000); // Close after 3 seconds
      } else {
        alert("❌ Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* UI kept same – only logic updated */}
      <DialogContent className="sm:max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Enquire Now
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-6">
            <h2 className="text-green-600 font-bold text-lg">
              🎉 Enquiry Submitted!
            </h2>
            <p className="text-gray-700 mt-2">
              Our team will reach out within 6 hours.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Mobile Number"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* STATE */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <select
                          className="w-full border rounded p-2"
                          {...field}
                        >
                          <option value="">Select State</option>
                          {statesList.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DISTRICT (like city) */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <select
                          className="w-full border rounded p-2"
                          disabled={!selectedState}
                          {...field}
                        >
                          <option value="">
                            {selectedState
                              ? "Select District"
                              : "Select State first"}
                          </option>
                          {districtOptions.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Pincode"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="briefDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="consentCall"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I agree to receive a call from Vikramshila Automobiles.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consentWhatsApp"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Allow Tata Motors to send information via WhatsApp.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
