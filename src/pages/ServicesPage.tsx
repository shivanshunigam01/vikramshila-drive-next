import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import Services from "@/components/home/Services";

export default function ServicesPage() {
  return (
    <div>
      <Helmet>
        <title>Services | Genuine Parts, Assistance, Fleetedge</title>
        <meta name="description" content="Tata Genuine Parts, Tata OK, Tata Alert, Suraksha AMC, and Fleetedge telematics at Vikramshila Automobiles." />
        <link rel="canonical" href="/services" />
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Services</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">Everything you need to keep your vehicle productive: parts availability, 24x7 assistance, extended warranties, and intelligent fleet solutions.</p>

        <section className="mt-6">
          <Services />
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-10">
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Tata Genuine Parts</h2>
            <p className="text-muted-foreground">OEM certified, warranty-backed parts ensuring long life and safety. Counter pickup and doorstep delivery available.</p>
          </article>
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Tata OK (Value Trucks)</h2>
            <p className="text-muted-foreground">Verified pre-owned commercial vehicles with transparent inspections and documentation.</p>
          </article>
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Tata Alert & On-Road Assistance</h2>
            <p className="text-muted-foreground">24x7 breakdown support and emergency services to minimize downtime.</p>
          </article>
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Suraksha AMC</h2>
            <p className="text-muted-foreground">Predictable maintenance costs and assured service intervals for worry-free operations.</p>
          </article>
          <article className="p-6 rounded border md:col-span-2">
            <h2 className="font-semibold mb-2">Fleetedge Telematics</h2>
            <p className="text-muted-foreground">Track vehicles, monitor driving behavior, plan maintenance, and improve TCO with real-time analytics.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
