"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

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
  const [activeForm, setActiveForm] = useState<"login" | "register" | null>(
    null
  );

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      // close on backdrop click
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Sheet on mobile, centered on desktop */}
      <Card
        className="
        relative z-10 w-full
        rounded-t-2xl sm:rounded-2xl
        bg-[#111] text-white vikram-card
        max-h-[92vh] sm:max-h-[90vh]
        overflow-y-auto
        // widths
        max-w-[92vw] sm:max-w-md
      "
      >
        <CardHeader className="text-center space-y-4 sticky top-0 z-10 bg-[#111]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111]/80">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle id="auth-modal-title" className="text-xl sm:text-2xl">
            {activeForm === "register"
              ? "Create an Account"
              : activeForm === "login"
              ? "Welcome Back"
              : "Please login to continue using Vikramshila"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {!activeForm ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="vikram-button flex-1"
                  onClick={() => setActiveForm("login")}
                >
                  Login
                </Button>
                <Button
                  className="vikram-button flex-1"
                  onClick={() => setActiveForm("register")}
                >
                  Register
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          ) : activeForm === "login" ? (
            <LoginForm
              onLogin={() => {
                onLoginSuccess();
                setActiveForm(null);
              }}
              onCancel={() => setActiveForm(null)}
            />
          ) : (
            <RegisterForm
              onRegister={() => {
                onLoginSuccess();
                setActiveForm(null);
              }}
              onCancel={() => setActiveForm(null)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
