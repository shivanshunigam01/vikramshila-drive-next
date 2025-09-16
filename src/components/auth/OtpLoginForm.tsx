"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { checkCustomer, sendOtp, otpLogin } from "@/services/authServices";

interface Props {
  onLogin: () => void;
  onCancel: () => void;
}

type Step = "phone" | "otp";

// ---- helpers ----
function normalizePhoneIndia(input: string) {
  const digits = input.replace(/\D/g, "");
  // Use the last 10 digits as the local Indian mobile
  const last10 = digits.slice(-10);
  const valid = last10.length === 10;
  // Always send E.164 to backend (Twilio friendly)
  const e164 = valid ? `+91${last10}` : "";
  return { digits, last10, e164, valid };
}

export default function OtpLoginForm({ onLogin, onCancel }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("phone");
  const [isExisting, setIsExisting] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [form, setForm] = useState({ phone: "", otp: "", name: "", email: "" });

  const phoneInfo = useMemo(
    () => normalizePhoneIndia(form.phone),
    [form.phone]
  );
  const { e164, last10, valid } = phoneInfo;

  // cooldown timer for resend
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSendOtp = async () => {
    try {
      if (!valid) {
        toast({
          title: "Invalid phone number",
          description: "Enter a valid Indian mobile (10 digits or +91…).",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);

      // 1) Ask backend if customer exists (use normalized E.164 to be consistent)
      const existsRes = await checkCustomer(e164);
      const exists = !!existsRes.data?.data?.exists;
      setIsExisting(exists);

      // 2) Send OTP
      await sendOtp(e164);
      toast({ title: "OTP sent", description: `Sent to ${e164}.` });
      setStep("otp");
      setCooldown(30);
    } catch (e: any) {
      toast({
        title: "Failed to send OTP",
        description: e?.response?.data?.message || e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    try {
      setIsLoading(true);
      const payload: any = { phone: e164, otp: form.otp.trim() };

      // if first time, require name; email optional
      if (isExisting === false) {
        if (!form.name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your name to complete first-time login.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        payload.name = form.name.trim();
        if (form.email.trim()) payload.email = form.email.trim();
      }

      const res = await otpLogin(payload);
      const { token, user } = res.data?.data || {};
      if (!token || !user) throw new Error("Invalid response from server");

      localStorage.setItem("customer_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Login successful" });
      onLogin();
    } catch (e: any) {
      toast({
        title: "Login failed",
        description: e?.response?.data?.message || e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = valid && !isLoading;
  const needDetails = isExisting === false; // only ask name/email on first login
  const canLogin =
    form.otp.trim().length === 6 &&
    (!needDetails || form.name.trim().length > 1);

  return (
    <div className="space-y-4">
      {step === "phone" && (
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile (India)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. 98xxxxxxxx or +91 98xxxxxxxx"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
            className="text-black"
          />
          <div className="text-xs text-gray-400">
            Detected: {last10 ? `+91 ${last10}` : "—"}
          </div>
          <Button
            className="bg-blue-600 text-white w-full"
            disabled={!canSend}
            onClick={handleSendOtp}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Sent to {e164 || form.phone}{" "}
              <button
                type="button"
                className="underline ml-2"
                onClick={() => {
                  setStep("phone");
                  setForm((p) => ({ ...p, otp: "" }));
                }}
              >
                edit
              </button>
            </span>
            <Button
              type="button"
              variant="ghost"
              className="px-2 py-0 h-7"
              disabled={cooldown > 0 || isLoading}
              onClick={handleSendOtp}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="6-digit OTP"
              maxLength={6}
              value={form.otp}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  otp: e.target.value.replace(/\D/g, ""),
                }))
              }
              required
              className="text-black"
            />
          </div>

          {needDetails && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="text-black"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-blue-600 text-white"
              disabled={!canLogin || isLoading}
              onClick={handleOtpLogin}
            >
              {isLoading ? "Logging in..." : "Continue"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
