// src/components/LoginModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/services/authServices";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      setLoading(false);

      if (res.success) {
        localStorage.setItem("auth", "true");
        onSuccess();
        onClose();
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white max-w-sm rounded-xl border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Admin Login Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-gray-900 border-gray-700 text-white"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
