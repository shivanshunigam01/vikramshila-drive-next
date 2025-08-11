import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import VideoCarousel from "@/components/home/VideoCarousel";

export default function VideosPage() {
  return (
    <div>
      <Helmet>
        <title>Videos | Walkthroughs, Testimonials, Dealer Tour</title>
        <meta name="description" content="Watch product walkthroughs, customer testimonials and dealer facility tour videos from Vikramshila Automobiles." />
        <link rel="canonical" href="/videos" />
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Videos</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">Explore vehicles, hear from our customers, and take a quick tour of our workshop facilities.</p>

        <section className="mt-6">
          <VideoCarousel />
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-10">
          {["dQw4w9WgXcQ", "ysz5S6PUM-U", "kJQP7kiw5Fk"].map((id) => (
            <div key={id} className="aspect-video w-full rounded overflow-hidden shadow-elegant">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="Product video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
