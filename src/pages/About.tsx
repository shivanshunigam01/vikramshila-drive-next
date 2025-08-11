import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import hero1 from "@/assets/hero-2.jpg";
import hero2 from "@/assets/hero-3.jpg";

export default function About() {
  return (
    <div>
      <Helmet>
        <title>About Vikramshila Automobiles | Tata Commercial Vehicles</title>
        <meta name="description" content="Know Vikramshila Automobiles: authorized Tata Motors commercial vehicles dealer. Mission, values, team, and customer-first commitment." />
        <link rel="canonical" href="/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vikramshila Automobiles Pvt. Ltd.",
            url: "/",
            logo: "/images/tata-logo.svg",
            sameAs: ["https://facebook.com/", "https://instagram.com/"],
          })}
        </script>
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">About Us</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Vikramshila Automobiles is an authorized dealership for Tata Motors Commercial Vehicles, delivering reliable trucks and buses across segments with best-in-class sales, finance and after-sales support.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 items-center">
          <img src={hero1} alt="Vikramshila Automobiles showroom" className="rounded shadow-elegant w-full h-auto" loading="lazy" />
          <article>
            <h2 className="text-xl font-semibold mb-2">Our Promise</h2>
            <p className="text-muted-foreground mb-4">
              Driven by Trust. Delivered with Pride. We focus on understanding your business needs and recommending the right vehicle with transparent pricing, quick finance, and dependable service.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              <li className="p-3 rounded bg-secondary">1000+ happy fleet owners</li>
              <li className="p-3 rounded bg-secondary">Pan-segment portfolio</li>
              <li className="p-3 rounded bg-secondary">Doorstep service support</li>
              <li className="p-3 rounded bg-secondary">Genuine parts and accessories</li>
            </ul>
          </article>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-10">
          <article className="p-6 rounded border">
            <h3 className="font-semibold mb-1">Mission</h3>
            <p className="text-muted-foreground">Enable businesses to move better with dependable vehicles, financing, and service experiences that reduce downtime and increase profitability.</p>
          </article>
          <article className="p-6 rounded border">
            <h3 className="font-semibold mb-1">Vision</h3>
            <p className="text-muted-foreground">Be the most trusted commercial vehicle partner in our region, recognized for customer-centricity and service excellence.</p>
          </article>
          <article className="p-6 rounded border">
            <h3 className="font-semibold mb-1">Values</h3>
            <p className="text-muted-foreground">Integrity, Reliability, Speed, and Care in every interaction.</p>
          </article>
        </section>

        <section className="mt-10 grid md:grid-cols-2 gap-6 items-center">
          <article>
            <h2 className="text-xl font-semibold mb-2">Facilities & Team</h2>
            <p className="text-muted-foreground mb-4">State-of-the-art showroom, multi-bay workshop, express service, skilled technicians, and mobile service vans to keep your fleet running.</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Computerized diagnostics and trained technicians</li>
              <li>Dedicated fleet account managers</li>
              <li>Priority vehicle delivery and onboarding</li>
            </ul>
          </article>
          <img src={hero2} alt="Workshop facility and team" className="rounded shadow-elegant w-full h-auto" loading="lazy" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
