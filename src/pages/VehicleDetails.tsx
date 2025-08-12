import { useParams } from "react-router-dom";
import { vehicles } from "@/data/products";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";
export default function VehicleDetails() {
  const { slug } = useParams();
  const v = vehicles.find((x) => x.slug === slug);
  if (!v) return <div className="min-h-screen">Vehicle not found</div>;

  return (
    <div>
      <Helmet>
        <title>{`${v.name} | Vikramshila Automobiles`}</title>
        <meta name="description" content={`${v.name} specifications, variants, price and brochure.`} />
        <link rel="canonical" href={`/products/${v.slug}`} />
      </Helmet>
      <Header />
      <main>
        <section className="container mx-auto py-6">
          <div className="relative rounded-lg overflow-hidden">
            <img src={v.images[0]} alt={`${v.name} hero image`} className="w-full h-64 md:h-96 object-cover" />
          </div>
        </section>

        <section className="container mx-auto grid lg:grid-cols-3 gap-8 py-6">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-semibold">{v.name}</h1>
            <p className="text-muted-foreground">{v.description}</p>

            <Carousel>
              <CarouselContent>
                {v.images.map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="rounded-lg overflow-hidden">
                      <img src={img} alt={`${v.name} gallery ${i + 1}`} className="w-full h-60 md:h-80 object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold mb-2">Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {v.specs.map((s) => (
                  <div key={s.key} className="flex justify-between border-b py-2"><span className="text-muted-foreground">{s.key}</span><span className="font-medium">{s.value}</span></div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold mb-2">Variants</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {v.variants.map((varn) => (
                  <li key={varn} className="rounded bg-muted/40 p-2">{varn}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Starting Price</div>
              <div className="text-2xl font-semibold">₹ {v.price.toLocaleString("en-IN")}</div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <a href={v.brochureUrl || '#'}><Button variant="outline">Download Brochure</Button></a>
                <a href={v.priceListUrl || '#'}><Button variant="accent">Price List</Button></a>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <FinanceCalculator initialPrice={v.price} />
            </div>
          </aside>
        </section>

        <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t p-3 flex gap-3 justify-center md:hidden">
          <Button variant="hero" onClick={() => openEnquiryDialog(v.name)}>Enquire Now</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
