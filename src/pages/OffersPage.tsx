import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import OffersSlider from "@/components/home/OffersSlider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OffersPage() {
  const offers = [
    { title: "₹0 Down Payment", desc: "Limited-period scheme on select models", expiry: "31 Dec 2025" },
    { title: "7.5% ROI", desc: "Attractive interest rate with partnered NBFCs", expiry: "30 Nov 2025" },
    { title: "₹10,000 Exchange Bonus", desc: "On evaluation and purchase of new vehicle", expiry: "31 Oct 2025" },
  ];

  return (
    <div>
      <Helmet>
        <title>Offers & Schemes | Special Deals on Commercial Vehicles</title>
        <meta name="description" content="Discover current schemes: zero down payment, low ROI, exchange bonus and seasonal offers at Vikramshila Automobiles." />
        <link rel="canonical" href="/offers" />
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Current Offers</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">Grab limited-time deals across the Tata Motors commercial vehicle range. Subject to credit approval and T&C.</p>

        <section className="mt-6">
          <OffersSlider />
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-10">
          {offers.map((o) => (
            <Card key={o.title} className="shadow-elegant">
              <CardHeader>
                <CardTitle>{o.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{o.desc}</p>
                <p className="text-xs text-muted-foreground">Valid till: {o.expiry}</p>
                <Button variant="accent" className="mt-4">Claim This Offer</Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
