"use client";

import { useState } from "react";
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-[#111] text-white vikram-card">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {activeForm === "register"
              ? "Create an Account"
              : activeForm === "login"
              ? "Welcome Back"
              : "Please login to continue using Vikramshila"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeForm ? (
            <div className="space-y-4">
              <div className="flex gap-4">
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
