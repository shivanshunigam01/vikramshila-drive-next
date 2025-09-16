"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, X } from "lucide-react";
import OtpLoginForm from "./OtpLoginForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AuthModal({
  open,
  onClose,
  onLoginSuccess,
}: AuthModalProps) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="relative w-full max-w-md bg-[#111] text-white vikram-card">
        {/* Close button */}
        <button
          aria-label="Close"
          className="absolute right-3 top-3 p-1 rounded-md hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Login with Mobile OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your phone number to receive OTP. First time we’ll ask your
            <span className="text-white font-medium"> Name</span> (required) and
            <span className="text-white font-medium"> Email</span> (optional).
          </p>
        </CardHeader>

        <CardContent>
          <OtpLoginForm
            onLogin={() => {
              onLoginSuccess();
              onClose();
            }}
            onCancel={onClose}
          />

          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
