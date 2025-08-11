import { Wrench, ShieldCheck, AlertTriangle, Package, Route } from "lucide-react";

const items = [
  { icon: Wrench, title: "Tata Genuine Parts", desc: "Reliable, durable, and warranty-backed genuine parts." },
  { icon: ShieldCheck, title: "Tata OK", desc: "Certified pre-owned vehicles with trust and transparency." },
  { icon: AlertTriangle, title: "Tata Alert", desc: "24x7 roadside assistance to keep you moving." },
  { icon: Package, title: "Suraksha", desc: "Comprehensive AMC for peace of mind." },
  { icon: Route, title: "Fleetedge", desc: "Smart telematics for efficient fleet operations." },
];

export default function Services() {
  return (
    <section className="container mx-auto py-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Services</h2>
        <p className="text-muted-foreground">End-to-end care from purchase to performance</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((i) => (
          <div key={i.title} className="rounded-lg border p-4 hover-scale bg-muted/30">
            <i.icon className="h-6 w-6 text-primary" />
            <h3 className="font-medium mt-2">{i.title}</h3>
            <p className="text-sm text-muted-foreground">{i.desc}</p>
            <a href="#" className="text-sm story-link">Know More</a>
          </div>
        ))}
      </div>
    </section>
  );
}
