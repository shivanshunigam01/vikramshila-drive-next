import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories, vehicles } from "@/data/products";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  return (
    <section className="container mx-auto py-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Product Showcase</h2>
        <p className="text-muted-foreground">SCV Cargo, Pickup, LCV, ICV, MCV, Winger, Buses</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Card key={c.key} className="hover-scale shadow-elegant">
            <CardHeader className="p-0">
              <div className="overflow-hidden rounded-t-lg">
                <img src={c.image} alt={`${c.title} category vehicles`} className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{c.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="accent">Book Test Drive</Button>
                <Link to="/products" className="story-link">View Details</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
