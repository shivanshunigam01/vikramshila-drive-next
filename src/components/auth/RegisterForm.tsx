"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/services/authServices";
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
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerUser(payload);

      if (response.data?.success) {
        const { token, customer } = response.data;
        toast({ title: "Registration Successful" });
        navigate("/");
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
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
    </form>
  );
}
