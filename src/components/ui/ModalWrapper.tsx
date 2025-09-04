"use client";
import { ReactNode, useRef } from "react";

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({
  open,
  onClose,
  children,
}: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
      onClick={handleClickOutside} // <-- closes when clicking outside
    >
      <div
        ref={modalRef}
        className="bg-black rounded-xl shadow-lg w-full max-w-2xl p-4 md:p-6 relative overflow-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
