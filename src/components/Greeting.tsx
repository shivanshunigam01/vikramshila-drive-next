"use client";
export function Greeting() {
  // read once from localStorage (client-side)
  let user: { name?: string } | null = null;
  if (typeof window !== "undefined") {
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }
  }

  if (!user?.name) return null;

  const first = String(user.name).trim().split(" ")[0];

  return (
    <p className="text-sm md:text-base font-medium">
      Welcome Mr. {first} to Virtual showroom of Vikramshila Automobiles.
    </p>
  );
}
