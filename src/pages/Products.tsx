import { vehicles } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function Products() {
  return (
    <div>
      <Helmet>
        <title>Products | Vikramshila Automobiles</title>
        <meta name="description" content="Explore Tata commercial vehicles: SCV, Pickup, LCV, ICV, MCV, Winger & Buses." />
        <link rel="canonical" href="/products" />
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-2">All Vehicles</h1>
        <p className="text-muted-foreground mb-6">Choose from our best-selling lineup</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Card key={v.slug} className="hover-scale shadow-elegant">
              <CardHeader className="p-0">
                <img src={v.images[0]} alt={`${v.name} image`} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{v.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{v.description}</p>
                <div className="text-sm mt-2">Starting at <span className="font-medium">₹ {v.price.toLocaleString("en-IN")}</span></div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Link to={`/products/${v.slug}`}><Button variant="outline">View Details</Button></Link>
                  <Button variant="accent">Book This Vehicle</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
