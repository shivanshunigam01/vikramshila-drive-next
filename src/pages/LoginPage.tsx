import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAuthForm from "@/components/UserAuthForm";

export default function LoginPage() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // Close modal navigates back
  useEffect(() => {
    if (!open) navigate(-1);
  }, [open, navigate]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="bg-black text-white rounded-2xl p-6 shadow-2xl border border-gray-800 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            Login
          </DialogTitle>
        </DialogHeader>

        <UserAuthForm
          mode="login"
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
