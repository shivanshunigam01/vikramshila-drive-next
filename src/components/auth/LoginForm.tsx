"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/services/authServices";

interface LoginFormProps {
  onLogin: () => void;
  onCancel: () => void;
}

export default function LoginForm({ onLogin, onCancel }: LoginFormProps) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // debugger;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({
        email: formData.username,
        password: formData.password,
      });
      // ✅ Check API structure
      console.log(response);
      if (response.data?.success) {
        const { token, user } = response.data.data;
        toast({ title: "Login Successful" });

        // Save token & user in localStorage (or context)
        localStorage.setItem("admin_token", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();

        // setTimeout(() => {
        //   window.location.reload();
        // }, 400);

        onLogin(); // trigger parent success callback
      } else {
        toast({
          title: "Login Failed",
          description:
            response?.data?.message || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description:
          err.response?.data?.message || "Something went wrong, try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter Email"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          className="bg-white text-black placeholder-gray-500"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="bg-white text-black placeholder-gray-500 pr-10"
          />
          <Button
            type="button"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-black bg-transparent hover:bg-gray-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="vikram-button flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <Button
          type="button"
          className="vikram-button flex-1"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
