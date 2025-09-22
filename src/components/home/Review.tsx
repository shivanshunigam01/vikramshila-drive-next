import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useMemo, useEffect } from "react";
import { createLead, downloadCibilReport } from "@/services/leadService";
import { fetchCibil } from "@/services/leadService";
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

/* ---------- Utils ---------- */
function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

const MAX_KYC_SIZE = 10 * 1024 * 1024; // 10 MB
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

// TODO: replace with live DSE list from your backend
const DSE_OPTIONS = [
  { id: "dse_001", name: "Amit Kumar" },
  { id: "dse_002", name: "Pooja Singh" },
  { id: "dse_003", name: "Ravi Raj" },
];

export default function ReviewQuote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // KYC state (updated: added full name + consent for bureau)
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
  const [kycConsent, setKycConsent] = useState(false); // must be checked to pull bureau

  // Applicant modal state (ALL OPTIONAL)
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [financeCustomerName, setFinanceCustomerName] = useState("");
  const [addressLine, setAddressLine] = useState("");
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

  const state = location.state as LocationState;

  useEffect(() => {
    const found = DSE_OPTIONS.find((d) => d.id === dseId);
    if (found) setDseName(found.name);
  }, [dseId]);

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
    return true;
  };

  // Is any KYC provided?
  const kycProvided =
    !!aadharNumber ||
    !!panNumber ||
    !!aadharFile ||
    !!panCardFile ||
    !!(phoneNumber && panNumber);

  /** Build and submit the FormData. Called from BOTH modal buttons. */
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

      // ---------- OPTIONAL Applicant Details ----------
      const appendIf = (key: string, val?: string) => {
        if (val && String(val).trim() !== "")
          form.append(key, String(val).trim());
      };

      appendIf("financeCustomerName", financeCustomerName);
      appendIf("addressLine", addressLine);
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

      // Optional KYC numbers (normalized)
      appendIf("aadharNumber", onlyDigits(aadharNumber));
      appendIf("panNumber", panNumber.toUpperCase());
      appendIf("kycPhone", onlyDigits(phoneNumber));

      // Optional KYC files
      if (aadharFile) form.append("aadharFile", aadharFile);
      if (panCardFile) form.append("panCardFile", panCardFile);

      // KYC/CIBIL meta flags
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

      // Attach CIBIL result if already fetched
      if (cibilScore !== null) form.append("cibilScore", String(cibilScore));
      if (cibilStatus) form.append("cibilStatus", cibilStatus);

      // Name used for CIBIL pull
      appendIf("fullNameForCibil", fullNameForCibil);

      // Optional: reference for charge/provider
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

  console.log(
    "Razorpay present?",
    typeof (window as any).Razorpay === "function"
  );
  console.log("Key present?", !!import.meta.env.VITE_RAZORPAY_KEY_ID);
  // console.log("Order id:", order?.id);

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
              {/* Added: Full Name for CIBIL */}
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

              {/* Consent (required if KYC provided or pulling CIBIL) */}
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

            {/* Fetch CIBIL Score using new API */}
            <Button
              onClick={async () => {
                // Validation
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
                  setCibilResponse(resp); // or resp.raw if you choose to include it
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

            {/* OPEN MODAL INSTEAD OF DIRECT SUBMIT */}
            <Button
              onClick={() => setShowApplicantModal(true)}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
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
                    if (!cibilResponse) {
                      toast.error(
                        "Please fetch CIBIL before downloading the report."
                      );
                      return;
                    }
                    try {
                      await downloadCibilReport(cibilResponse, loggedInUser);
                      toast.success("CIBIL Report downloaded successfully!");
                    } catch {
                      toast.error("Failed to download CIBIL Report.");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Download CIBIL Report (PDF)
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

      {/* ---------- Modal: Applicant Details (ALL OPTIONAL) ---------- */}
      {showApplicantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowApplicantModal(false)}
          />
          {/* modal card */}
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
                  <p className="text-sm text-gray-400 mb-2">District</p>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g., Bhagalpur"
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
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
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  />
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
                <div>
                  <p className="text-sm text-gray-400 mb-2">DSE Selection</p>
                  <select
                    value={dseId}
                    onChange={(e) => setDseId(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  >
                    <option value="">Select DSE (optional)</option>
                    {DSE_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="border-gray-600 text-gray-200 hover:bg-gray-800"
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
