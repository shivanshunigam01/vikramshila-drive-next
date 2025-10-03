import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import hero1 from "@/assets/hero-2.jpg";
import hero2 from "@/assets/hero-3.jpg";

export default function About() {
  return (
    <div>
      <Helmet>
        <title>
          About Vikramshila Automobiles | Tata Commercial Vehicle Dealer
        </title>
        <meta
          name="description"
          content="Learn about Vikramshila Automobiles, your trusted Tata Motors Commercial Vehicles dealership. Our mission, vision, values, facilities, and customer-first approach."
        />
        <link rel="canonical" href="/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vikramshila Automobiles Pvt. Ltd.",
            url: "https://vikramshilaautomobiles.com",
            logo: "/images/tata-logo.svg",
            sameAs: [
              "https://facebook.com/vikramshila",
              "https://instagram.com/vikramshila",
            ],
          })}
        </script>
      </Helmet>

      <Header />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
            Vikramshila Automobiles is an authorized Tata Motors Commercial
            Vehicles dealership, committed to providing reliable trucks, buses,
            and passenger vehicles with unmatched sales, finance, and
            after-sales support.
          </p>
        </header>

        {/* Promise Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <img
            src={hero1}
            alt="Vikramshila Automobiles showroom exterior"
            className="rounded-lg shadow-md w-full h-auto"
            loading="lazy"
          />
          <article>
            <h2 className="text-2xl font-semibold mb-3">Our Promise</h2>
            <p className="text-muted-foreground mb-5">
              <strong>Driven by Trust. Delivered with Pride.</strong> We
              prioritize understanding your business needs to recommend the
              right vehicle with transparent pricing, quick finance solutions,
              and dependable service.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              <li className="p-3 rounded bg-secondary shadow-sm">
                1000+ satisfied fleet owners
              </li>
              <li className="p-3 rounded bg-secondary shadow-sm">
                Full-range portfolio
              </li>
              <li className="p-3 rounded bg-secondary shadow-sm">
                Doorstep service support
              </li>
              <li className="p-3 rounded bg-secondary shadow-sm">
                Genuine parts & accessories
              </li>
            </ul>
          </article>
        </section>

        {/* Mission Vision Values */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <article className="p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Mission</h3>
            <p className="text-muted-foreground text-sm">
              To empower businesses to move better with dependable vehicles,
              flexible financing, and world-class service experiences that
              reduce downtime and improve profitability.
            </p>
          </article>
          <article className="p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Vision</h3>
            <p className="text-muted-foreground text-sm">
              To be the most trusted commercial vehicle partner in our region,
              recognized for customer focus, innovation, and service excellence.
            </p>
          </article>
          <article className="p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Values</h3>
            <p className="text-muted-foreground text-sm">
              Integrity, Reliability, Speed, and Care — the pillars guiding
              every interaction with our customers and partners.
            </p>
          </article>
        </section>

        {/* Facilities Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <article>
            <h2 className="text-2xl font-semibold mb-3">Facilities & Team</h2>
            <p className="text-muted-foreground mb-5">
              Our state-of-the-art facilities and expert team ensure your fleet
              stays road-ready. From a modern showroom to a fully equipped
              multi-bay workshop, express service bays, and mobile vans, we
              deliver complete care.
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
              <li>Computerized diagnostics with OEM-grade tools</li>
              <li>Dedicated fleet account managers</li>
              <li>Priority vehicle delivery and onboarding support</li>
            </ul>
          </article>
          <img
            src={hero2}
            alt="Workshop facilities and service team at Vikramshila Automobiles"
            className="rounded-lg shadow-md w-full h-auto"
            loading="lazy"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
