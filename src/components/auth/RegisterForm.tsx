"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/services/authServices";

interface RegisterFormProps {
  onRegister: () => void;
  onCancel: () => void;
}

export default function RegisterForm({
  onRegister,
  onCancel,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fake OTP generator
  const handleSendOtp = () => {
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(fakeOtp);
    setFormData({ ...formData, otp: fakeOtp }); // auto-fill OTP
    toast({ title: "OTP Sent", description: `Fake OTP: ${fakeOtp}` });
    setStep("otp");
  };

  // Fake OTP verify
  const handleVerifyOtp = () => {
    if (formData.otp === generatedOtp) {
      toast({ title: "Email Verified", description: "You can continue now." });
      setStep("details");
    } else {
      toast({ title: "Invalid OTP", variant: "destructive" });
    }
  };

  // Final Register
  const handleRegister = async (data: any) => {
    try {
      // Fake OTP verification bypass
      const payload = {
        email: data.email,
        password: data.password,
        otp: "123456", // send fixed otp (backend may accept)
        otp_verified: true, // if backend supports this flag
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        onRegister();
      } else {
        console.error(result.message || "Register failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Step 1: Enter Email */}
      {step === "email" && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="text-black"
          />
          <Button
            type="button"
            onClick={handleSendOtp}
            className="bg-blue-600 text-white w-full"
            disabled={isLoading || !formData.email}
          >
            Send OTP
          </Button>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {step === "otp" && (
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            required
            className="text-black"
          />
          <Button
            type="button"
            onClick={handleVerifyOtp}
            className="bg-blue-600 text-white w-full"
            disabled={isLoading || !formData.otp}
          >
            Verify OTP
          </Button>
        </div>
      )}

      {/* Step 3: Enter Details */}
      {step === "details" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="text-black"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-blue-600 text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
