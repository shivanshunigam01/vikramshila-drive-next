import { useMemo, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchCibil, downloadCibilReport } from "@/services/leadService";
import {
  Loader2,
  Shield,
  CreditCard,
  Download,
  Paperclip,
  X,
} from "lucide-react";

/* ---------- Local helpers (drop-in) ---------- */
const onlyDigits = (s: string) => s.replace(/\D+/g, "");
const MAX_KYC_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const cn = (...x: (string | false | null | undefined)[]) =>
  x.filter(Boolean).join(" ");

function validateImage(file: File | null | undefined, label: string) {
  if (!file) return true;
  if (!ALLOWED_MIME.includes(file.type)) {
    toast.error(`${label}: Only JPG/PNG/WEBP/AVIF allowed.`);
    return false;
  }
  if (file.size > MAX_KYC_SIZE) {
    toast.error(`${label}: File too large (max 10MB).`);
    return false;
  }
  return true;
}

export default function CibilCheckWidget() {
  // Inputs
  const [fullName, setFullName] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [consent, setConsent] = useState(false);

  // Optional files
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);

  // State
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [meta, setMeta] = useState<{
    report_number?: number | null;
    report_date?: number | null;
    report_time?: number | null;
  } | null>(null);

  // Validation
  const panValid = useMemo(
    () => /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.trim()),
    [pan]
  );
  const mobileValid = useMemo(
    () => /^\d{10}$/.test(onlyDigits(mobile)),
    [mobile]
  );

  const inputClass =
    "mt-2 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-blue-600";
  const labelClass = "text-sm font-medium text-gray-300";

  /* ---------- File handlers ---------- */
  const onAadhaarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!validateImage(f, "Aadhaar")) {
      e.target.value = "";
      setAadhaarFile(null);
      return;
    }
    setAadhaarFile(f);
  };
  const onPanFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!validateImage(f, "PAN")) {
      e.target.value = "";
      setPanFile(null);
      return;
    }
    setPanFile(f);
  };

  /* ---------- Actions ---------- */
  const doFetch = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter full name (as per PAN).");
      return;
    }
    if (!mobileValid) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!panValid) {
      toast.error("Enter a valid PAN (ABCDE1234F).");
      return;
    }
    if (!consent) {
      toast.error("Please provide consent to proceed.");
      return;
    }
    if (aadhaarFile && !validateImage(aadhaarFile, "Aadhaar")) return;
    if (panFile && !validateImage(panFile, "PAN")) return;

    try {
      setIsFetching(true);
      setAttempted(true);
      setStatus(null);

      const resp = await fetchCibil({
        name: fullName.trim(),
        mobile: onlyDigits(mobile),
        pan: pan.toUpperCase(),
        consent: "Y",
      });

      setScore(resp.score);
      setStatus(resp.ok ? "success" : "failed");
      setMeta({
        report_number: resp.report_number ?? null,
        report_date: resp.report_date ?? null,
        report_time: resp.report_time ?? null,
      });

      if (resp.ok && resp.score != null)
        toast.success("CIBIL fetched successfully.");
      else toast.error("CIBIL fetch failed or score not available.");
    } catch (e: any) {
      setStatus("failed");
      toast.error(e?.message || "Failed to fetch CIBIL score.");
    } finally {
      setIsFetching(false);
    }
  };

  const doDownload = async () => {
    try {
      if (!fullName.trim() || !mobileValid || !panValid) {
        toast.error("Fill Name, Mobile and PAN correctly first.");
        return;
      }
      setIsDownloading(true);
      await downloadCibilReport({
        name: fullName.trim(),
        mobile: onlyDigits(mobile),
        pan: pan.toUpperCase(),
      });
      toast.success("CIBIL Report Downloaded Successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to open CIBIL Report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const canShowDownload = attempted;
  const canEnableDownload = status === "success";

  /* ---------- UI ---------- */
  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-10 text-left">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                CIBIL Check
              </h2>
              <p className="text-gray-400 mt-1 text-sm">
                Secure payment via Razorpay · Soft pull · Instant result
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Controls (match FinanceCalculator style) */}
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Full Name (as per PAN)</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Vishal Rathore"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>PAN Number</label>
                <Input
                  value={pan}
                  onChange={(e) =>
                    setPan(e.target.value.toUpperCase().slice(0, 10))
                  }
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className={cn(
                    inputClass,
                    !panValid && pan.length > 0 && "border-red-600"
                  )}
                />
                {!panValid && pan.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    Invalid PAN format
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <Input
                  value={mobile}
                  onChange={(e) =>
                    setMobile(onlyDigits(e.target.value).slice(0, 10))
                  }
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  maxLength={10}
                  className={cn(
                    inputClass,
                    !mobileValid && mobile.length > 0 && "border-red-600"
                  )}
                />
                {!mobileValid && mobile.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">Enter 10 digits</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Aadhaar Number (optional)</label>
                <Input
                  value={aadhaar}
                  onChange={(e) =>
                    setAadhaar(onlyDigits(e.target.value).slice(0, 12))
                  }
                  placeholder="12-digit Aadhaar"
                  inputMode="numeric"
                  maxLength={12}
                  className={inputClass}
                />
              </div>
              <div className="flex items-start gap-2 pt-8">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-blue-600"
                />
                <label htmlFor="consent" className="text-sm text-gray-300">
                  I consent to share my KYC details and authorize a soft bureau
                  pull. A small Razorpay fee applies.
                </label>
              </div>
            </div>

            {/* Optional files row (compact, like calculator UI) */}
            <div className="rounded-xl border border-gray-800 p-4 bg-[#1e2125]">
              <p className="text-xs text-gray-400 mb-3">
                Optional attachments (not required for bureau pull)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAadhaarFile}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg">
                      <Paperclip className="h-4 w-4" /> Aadhaar image
                    </span>
                  </label>
                  {aadhaarFile && (
                    <span className="text-xs text-gray-300 inline-flex items-center gap-2">
                      {aadhaarFile.name}
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setAadhaarFile(null)}
                        aria-label="Clear Aadhaar file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPanFile}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg">
                      <Paperclip className="h-4 w-4" /> PAN image
                    </span>
                  </label>
                  {panFile && (
                    <span className="text-xs text-gray-300 inline-flex items-center gap-2">
                      {panFile.name}
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setPanFile(null)}
                        aria-label="Clear PAN file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary action (matches calculator button sizing) */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={doFetch}
                disabled={isFetching}
                className="bg-green-600 hover:bg-green-700 text-white text-sm inline-flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay & Fetch CIBIL Score
                  </>
                )}
              </Button>

              {attempted && (
                <Button
                  onClick={doDownload}
                  disabled={!canEnableDownload || isDownloading}
                  className={cn(
                    "bg-purple-600 hover:bg-purple-700 text-white text-sm inline-flex items-center gap-2",
                    !canEnableDownload && "opacity-60 cursor-not-allowed"
                  )}
                  title={
                    canEnableDownload
                      ? "Download your Experian PDF"
                      : "Complete a successful CIBIL fetch to enable download"
                  }
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading…
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download CIBIL Report (PDF)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right: Result Card (styled like calculator card) */}
          <div className="rounded-xl border border-gray-800 p-6 bg-[#1e2125] shadow-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={cn(
                    "font-medium",
                    status === "success" && "text-green-400",
                    status === "failed" && "text-red-400",
                    !status && "text-gray-300"
                  )}
                >
                  {isFetching ? "processing…" : status ?? "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">CIBIL Score</span>
                <span className="text-2xl font-semibold text-blue-400">
                  {score ?? "—"}
                </span>
              </div>

              <div className="h-px bg-gray-800 my-3" />

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Report #</p>
                  <p className="text-white font-medium mt-1">
                    {meta?.report_number ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Date</p>
                  <p className="text-white font-medium mt-1">
                    {meta?.report_date ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-gray-400">Time</p>
                  <p className="text-white font-medium mt-1">
                    {meta?.report_time ?? "—"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-3">
                We don’t store your card details. Payments are processed
                securely by Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
