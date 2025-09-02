"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sendOtp, verifyOtp, registerUser } from "@/services/authServices";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onRegister: () => void;
  onCancel: () => void;
}

export default function RegisterForm({
  onRegister,
  onCancel,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    password: "",
  });

  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      await sendOtp(formData.phone);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the OTP.",
      });
      setStep("otp");
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      await verifyOtp(formData.phone, formData.otp);
      toast({ title: "OTP Verified", description: "You can continue now." });
      setStep("details");
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Final Register
  // Step 3: Final Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerUser(payload);

      if (response.data?.success) {
        // ✅ Save token & customer in localStorage
        const { token, customer } = response.data;
        toast({ title: "Registration Successful" });
        navigate("/");

        // ✅ Move to login screen
        onRegister();
      } else {
        toast({
          title: "Registration Failed",
          description: response.data?.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Step 1: Phone Number */}
      {step === "phone" && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className="text-black"
          />
          <Button
            type="button"
            onClick={handleSendOtp}
            className="bg-blue-600 text-white w-full"
            disabled={isLoading || !formData.phone}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      )}

      {/* Step 2: OTP */}
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
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      )}

      {/* Step 3: Details */}
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
              className="flex-1 bg-gray-400 text-white"
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
